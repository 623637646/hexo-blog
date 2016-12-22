---
title: OpenGL ES笔记
categories:
  - OpenGL ES
tags:
  - OpenGL ES
  - OpenGL
  - iOS
date: 2016-12-21 00:00:00
---

[源码点这里](https://github.com/623637646/OpenGL-ES-Example)

参考
* [罗朝辉（飘飘白云）](http://blog.csdn.net/kesalin/article/category/1288827)

# Hello Word
这个hello word 有点简单哦，就是个绿色背景

## CAEAGLLayer，图层
为了让 UIView 显示 opengl 内容，我们必须将默认的 layer 类型修改为 CAEAGLLayer 类型

```objc
+ (Class)layerClass {
    // 只有 [CAEAGLLayer class] 类型的 layer 才支持在其上描绘 OpenGL 内容。
    return [CAEAGLLayer class];
}
```

```objc
- (void)setupLayer
{
    _eaglLayer = (CAEAGLLayer*) self.layer;
    
    // 设置描绘属性，在这里设置不维持渲染内容以及颜色格式为 RGBA8
    _eaglLayer.drawableProperties = [NSDictionary dictionaryWithObjectsAndKeys:
                                     [NSNumber numberWithBool:NO], kEAGLDrawablePropertyRetainedBacking, kEAGLColorFormatRGBA8, kEAGLDrawablePropertyColorFormat, nil];
}
```

## EAGLContext，环境上下文
context 管理所有使用OpenGL ES 进行描绘的状态，命令以及资源信息
```objc
- (void)setupContext {
    // 指定 OpenGL 渲染 API 的版本，在这里我们使用 OpenGL ES 2.0 
    EAGLRenderingAPI api = kEAGLRenderingAPIOpenGLES2;
    _context = [[EAGLContext alloc] initWithAPI:api];
    if (!_context) {
        NSLog(@"Failed to initialize OpenGLES 2.0 context");
        exit(1);
    }
    
    // 设置为当前上下文
    if (![EAGLContext setCurrentContext:_context]) {
        NSLog(@"Failed to set current OpenGL context");
        exit(1);
    }
}
```

## renderbuffer，渲染缓冲区
有了上下文，openGL还需要在一块 buffer 上进行描绘，这块 buffer 就是 RenderBuffer（OpenGL ES 总共有三大不同用途的color buffer，depth buffer 和 stencil buffer，这里是最基本的 color buffer）
```objc
- (void)setupRenderBuffer {
    glGenRenderbuffers(1, &_colorRenderBuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, _colorRenderBuffer);
    // 为 color renderbuffer 分配存储空间
    [_context renderbufferStorage:GL_RENDERBUFFER fromDrawable:_eaglLayer];
    
}
```

**glGenRenderbuffers 的原型为：**
```objc
void glGenRenderbuffers (GLsizei n, GLuint* renderbuffers)
```
它是为 renderbuffer 申请一个 id（或曰名字）。参数 n 表示申请生成 renderbuffer 的个数，而 renderbuffers 返回分配给 renderbuffer 的 id，注意：返回的 id 不会为0，id 0 是OpenGL ES 保留的，我们也不能使用 id 为0的 renderbuffer。

**glBindRenderbuffer 的原型为：**
```objc
void glBindRenderbuffer (GLenum target, GLuint renderbuffer) 
```
这个函数将指定 id 的 renderbuffer 设置为当前 renderbuffer。参数 target 必须为 GL_RENDERBUFFER，参数 renderbuffer 是就是使用 glGenRenderbuffers 生成的 id。当指定 id 的 renderbuffer 第一次被设置为当前 renderbuffer 时，会初始化该 renderbuffer 对象，其初始值为：
* width 和 height：像素单位的宽和高，默认值为0；
* internal format：内部格式，三大 buffer 格式之一 -- color，depth or stencil；
* Color bit-depth：仅当内部格式为 color 时，设置颜色的 bit-depth，默认值为0；
* Depth bit-depth：仅当内部格式为 depth时，默认值为0；
* Stencil bit-depth: 仅当内部格式为 stencil，默认值为0；

**renderbufferStorage:fromDrawable: 的原型为：**
```objc
/* Attaches an EAGLDrawable as storage for the OpenGL ES renderbuffer object bound to <target> */
- (BOOL)renderbufferStorage:(NSUInteger)target fromDrawable:(id<EAGLDrawable>)drawable; 
```
在内部使用 drawable（在这里是 EAGLLayer）的相关信息（还记得在 setupLayer 时设置了drawableProperties的一些属性信息么？）作为参数调用了 glRenderbufferStorage(GLenum target, GLenum internalformat, GLsizei width, GLsizei height); 后者 glRenderbufferStorage 指定存储在 renderbuffer 中图像的宽高以及颜色格式，并按照此规格为之分配存储空间。在这里，将使用我们在前面设置 eaglLayer 的颜色格式 RGBA8， 以及 eaglLayer 的宽高作为参数调用 glRenderbufferStorage。

## framebuffer，frame缓冲区
framebuffer object 通常也被称之为 FBO，它相当于 buffer(color, depth, stencil)的管理者，三大buffer 可以附加到一个 FBO 上。我们是用 FBO 来在 off-screen buffer上进行渲染。下面，我们依然创建私有方法 setupFrameBuffer 来生成 frame buffer：
```objc
- (void)setupFrameBuffer {
    glGenFramebuffers(1, &_frameBuffer);
    // 设置为当前 framebuffer
    glBindFramebuffer(GL_FRAMEBUFFER, _frameBuffer);
    // 将 _colorRenderBuffer 装配到 GL_COLOR_ATTACHMENT0 这个装配点上
    glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                              GL_RENDERBUFFER, _colorRenderBuffer);
}
```

setupFrameBuffer 大体与前面的 setupRenderBuffer 相同，由 glGenFramebuffers分配的 id也不可能是 0，id 为 0 的 framebuffer 是OpenGL ES 保留的，它指向窗口系统提供的 framebuffer，我们同样不能使用 id 为 0 的framebuffer，否则系统会出错。glFramebufferRenderbuffer的函数原型为：
```objc
void glFramebufferRenderbuffer (GLenum target, GLenum attachment, GLenum renderbuffertarget, GLuint renderbuffer)
```
该函数是将相关 buffer（三大buffer之一）attach到framebuffer上（如果 renderbuffer不为 0，知道前面为什么说glGenRenderbuffers 返回的id 不会为 0 吧）或从 framebuffer上detach（如果 renderbuffer为 0）。参数 attachment 是指定 renderbuffer 被装配到那个装配点上，其值是GL_COLOR_ATTACHMENT0, GL_DEPTH_ATTACHMENT, GL_STENCIL_ATTACHMENT中的一个，分别对应 color，depth和 stencil三大buffer。

## 销毁缓冲区
当 UIView 在进行布局变化之后，由于 layer 的宽高变化，导致原来创建的 renderbuffer不再相符，我们需要销毁既有 renderbuffer 和 framebuffer。下面，我们依然创建私有方法 destoryRenderAndFrameBuffer 来销毁生成的 buffer:
```objc
- (void)destoryRenderAndFrameBuffer
{
    glDeleteFramebuffers(1, &_frameBuffer);
    _frameBuffer = 0;
    glDeleteRenderbuffers(1, &_colorRenderBuffer);
    _colorRenderBuffer = 0;
}
```
## render
```objc
- (void)render {
    glClearColor(0, 1.0, 0, 1.0);
    glClear(GL_COLOR_BUFFER_BIT);

    [_context presentRenderbuffer:GL_RENDERBUFFER];
}
```

```objc
glClearColor (GLclampf red, GLclampf green, GLclampf blue, GLclampfalpha)
```
用来设置清屏颜色，默认为黑色；

```objc 
glClear (GLbitfieldmask)
```
用来指定要用清屏颜色来清除由mask指定的buffer，mask 可以是 GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT的自由组合。在这里我们只使用到 color buffer，所以清除的就是 clolor buffer。

```objc
- (BOOL)presentRenderbuffer:(NSUInteger)target
```

是将指定 renderbuffer 呈现在屏幕上，在这里我们指定的是前面已经绑定为当前 renderbuffer 的那个，在 renderbuffer 可以被呈现之前，必须调用`renderbufferStorage:fromDrawable: `为之分配存储空间。在前面设置 drawable 属性时，我们设置`kEAGLDrawablePropertyRetainedBacking`为FALSE，表示不想保持呈现的内容，因此在下一次呈现时，应用程序必须完全重绘一次。将该设置为 TRUE 对性能和资源影像较大，因此只有当renderbuffer需要保持其内容不变时，我们才设置`kEAGLDrawablePropertyRetainedBacking`为 TRUE。

## 完善UIView，运行

```objc
@interface OpenGLView (){
    EAGLContext* _context;
    CAEAGLLayer* _eaglLayer;
    GLuint _colorRenderBuffer;
    GLuint _frameBuffer;
}
@end
```

```objc
- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        [self setupLayer];
        [self setupContext];
    }
    return self;
}
```

```objc
-(void)layoutSubviews{
    [super layoutSubviews];
    [self destoryRenderAndFrameBuffer];
    [self setupRenderBuffer];
    [self setupFrameBuffer];
    [self render];
}
```

## 效果
{% asset_img hello-word.png %}

# OpenGL ES渲染管线与着色器

在这个章节中，我们将学习OpenGL ES 渲染管线，顶点着色器和片元着色器相关知识，然后使用可编程管线在屏幕上描绘一个简单三角形。

## 渲染管线
在 OpenGL ES 1.0 版本中，支持固定管线，而 OpenGL ES 2.0 版本不再支持固定管线，只支持可编程管线。什么是管线？什么又是固定管线和可编程管线？管线（pipeline）也称渲染管线，因为 OpenGL ES在渲染处理过程中会顺序执行一系列操作，这一系列相关的处理阶段就被称为OpenGL ES 渲染管线。pipeline 来源于福特汽车生产车间的流水线作业，在OpenGL ES 渲染过程中也是一样，一个操作接着一个操作进行，就如流水线作业一样，这样的实现极大地提供了渲染的效率。整个渲染管线如下图所示：

{% asset_img shader-0.png %}

图中阴影部分的 Vertex Shader 和 Fragment Shader 是可编程管线。可编程管线就是说这个操作可以动态编程实现而不必固定写死在代码中。可动态编程实现这一功能一般都是脚本提供的，在OpenGL ES 中也一样，编写这样脚本的能力是由着色语言(Shader Language)提供的。那可编程管线有什么好处呢？方便我们动态修改渲染过程，而无需重写编译代码，当然也和很多脚本语言一样，调试起来不太方便。

再回到上图，这张图就是 OpenGL ES 的“架构图”，学习OpenGL ES 就是学习这张图中的每一个部分，在这里先粗略地介绍一下。

* Vertex Array/Buffer objects：顶点数据来源，这时渲染管线的顶点输入，通常使用 Buffer objects效率更好。在今天的示例中，简单起见，使用的是 Vertex Array；

* Vertex Shader：顶点着色器通过可编程的方式实现对顶点的操作，如进行坐标空间转换，计算 per-vertex color以及纹理坐标；

* Primitive Assembly：图元装配，经过着色器处理之后的顶点在图片装配阶段被装配为基本图元。OpenGL ES 支持三种基本图元：点，线和三角形，它们是可被 OpenGL ES 渲染的。接着对装配好的图元进行裁剪（clip）：保留完全在视锥体中的图元，丢弃完全不在视锥体中的图元，对一半在一半不在的图元进行裁剪；接着再对在视锥体中的图元进行剔除处理（cull）：这个过程可编码来决定是剔除正面，背面还是全部剔除。

* Rasterization：光栅化。在光栅化阶段，基本图元被转换为二维的片元(fragment)，fragment 表示可以被渲染到屏幕上的像素，它包含位置，颜色，纹理坐标等信息，这些值是由图元的顶点信息进行插值计算得到的。这些片元接着被送到片元着色器中处理。这是从顶点数据到可渲染在显示设备上的像素的质变过程。

* Fragment Shader：片元着色器通过可编程的方式实现对片元的操作。在这一阶段它接受光栅化处理之后的fragment，color，深度值，模版值作为输入。

* Per-Fragment Operation：在这一阶段对片元着色器输出的每一个片元进行一系列测试与处理，从而决定最终用于渲染的像素。这一系列处理过程如下：

{% asset_img shader-1.png %}

* Pixel ownership test：该测试决定像素在 framebuffer 中的位置是不是为当前 OpenGL ES 所有。也就是说测试某个像素是否对用户可见或者被重叠窗口所阻挡；

* Scissor Test：剪裁测试，判断像素是否在由 glScissor 定义的剪裁矩形内，不在该剪裁区域内的像素就会被剪裁掉；

* Stencil Test：模版测试，将模版缓存中的值与一个参考值进行比较，从而进行相应的处理；

* Depth Test：深度测试，比较下一个片段与帧缓冲区中的片段的深度，从而决定哪一个像素在前面，哪一个像素被遮挡；

* Blending：混合，混合是将片段的颜色和帧缓冲区中已有的颜色值进行混合，并将混合所得的新值写入帧缓冲；

* Dithering：抖动，抖动是使用有限的色彩让你看到比实际图象更多色彩的显示方式，以缓解表示颜色的值的精度不够大而导致的颜色剧变的问题。

* Framebuffer：这是流水线的最后一个阶段，Framebuffer 中存储这可以用于渲染到屏幕或纹理中的像素值，也可以从Framebuffer 中读回像素值，但不能读取其他值（如深度值，模版值等）。

## 顶点着色器

{% asset_img shader-2.png %}

顶点着色器接收的输入：

* Attributes：由 vertext array 提供的顶点数据，如空间位置，法向量，纹理坐标以及顶点颜色，它是针对每一个顶点的数据。属性只在顶点着色器中才有，片元着色器中没有属性。属性可以理解为针对每一个顶点的输入数据。OpenGL ES 2.0 规定了所有实现应该支持的最大属性个数不能少于 8 个。

* Uniforms：uniforms保存由应用程序传递给着色器的只读常量数据。在顶点着色器中，这些数据通常是变换矩阵，光照参数，颜色等。由 uniform 修饰符修饰的变量属于全局变量，该全局性对顶点着色器与片元着色器均可见，也就是说，这两个着色器如果被连接到同一个应用程序中，它们共享同一份 uniform 全局变量集。因此如果在这两个着色器中都声明了同名的 uniform 变量，要保证这对同名变量完全相同：同名+同类型，因为它们实际是同一个变量。此外，uniform 变量存储在常量存储区，因此限制了 uniform 变量的个数，OpenGL ES 2.0 也规定了所有实现应该支持的最大顶点着色器 uniform 变量个数不能少于 128 个，最大的片元着色器 uniform 变量个数不能少于 16 个。

* Samplers：一种特殊的 uniform，用于呈现纹理。sampler 可用于顶点着色器和片元着色器。

* Shader program：由 main 申明的一段程序源码，描述在顶点上执行的操作：如坐标变换，计算光照公式来产生 per-vertex 颜色或计算纹理坐标。

顶点着色器的输出：

Varying：varying 变量用于存储顶点着色器的输出数据，当然也存储片元着色器的输入数据，varying 变量最终会在光栅化处理阶段被线性插值。顶点着色器如果声明了 varying 变量，它必须被传递到片元着色器中才能进一步传递到下一阶段，因此顶点着色器中声明的 varying 变量都应在片元着色器中重新声明同名同类型的 varying 变量。OpenGL ES 2.0 也规定了所有实现应该支持的最大 varying 变量个数不能少于 8 个。

在顶点着色器阶段至少应输出位置信息-即内建变量：gl_Position，其它两个可选的变量为：gl_FrontFacing 和 gl_PointSize。

## 片元着色器

{% asset_img shader-3.png %}

片元管理器接受如下输入： 

* Varyings：这个在前面已经讲过了，顶点着色器阶段输出的 varying 变量在光栅化阶段被线性插值计算之后输出到片元着色器中作为它的输入，即上图中的 gl_FragCoord，gl_FrontFacing 和 gl_PointCoord。OpenGL ES 2.0 也规定了所有实现应该支持的最大 varying 变量个数不能少于 8 个。

* Uniforms：前面也已经讲过，这里是用于片元着色器的常量，如雾化参数，纹理参数等；OpenGL ES 2.0 也规定了所有实现应该支持的最大的片元着色器 uniform 变量个数不能少于 16 个。

* Samples：一种特殊的 uniform，用于呈现纹理。

* Shader program：由 main 申明的一段程序源码，描述在片元上执行的操作。

在顶点着色器阶段只有唯一的 varying 输出变量-即内建变量：gl_FragColor。

## 顶点着色与片元着色在编程上的差异

### 精度上的差异

着色语言定了三种级别的精度：lowp, mediump, highp。我们可以在 glsl 脚本文件的开头定义默认的精度。如下代码定义在 float 类型默认使用 highp 级别的精度

`precision highp float;`

在顶点着色阶段，如果没有用户自定义的默认精度，那么 int 和 float 都默认为 highp 级别；而在片元着色阶段，如果没有用户自定义的默认精度，那么就真的没有默认精度了，我们必须在每个变量前放置精度描述符。此外，OpenGL ES 2.0 标准也没有强制要求所有实现在片元阶段都支持 highp 精度的。我们可以通过查看是否定义 GL_FRAGMENT_PRECISION_HIGH 来判断具体实现是否在片元着色器阶段支持 highp 精度，从而编写出可移植的代码。当然，通常我们不需要在片元着色器阶段使用 highp 级别的精度，推荐的做法是先使用 mediump 级别的精度，只有在效果不够好的情况下再考虑 highp 精度。

### attribute 差异

attribute 修饰符只可用于顶点着色

### 其他

或由于精度的不同，或因为编译优化的原因，在顶点着色和片元着色阶段同样的计算可能会得到不同的结果，这会导致一些问题（z-fighting）。因此 glsl 引入了 invariant 修饰符来修饰在两个着色阶段的同一变量，确保同样的计算会得到相同的值。

## 使用顶点着色器与片元着色器

在前面提到可编程管线通过用 shader 语言编写脚本文件实现的，这些脚本文件相当于 C 源码，有源码就需要编译链接，因此需要对应的编译器与链接器，shader 对象与 program 对象就相当于编译器与链接器。shader 对象载入源码，然后编译成 object 形式(就像C源码编译成 .obj文件)。经过编译的 shader 就可以装配到 program 对象中，每个 program对象必须装配两个 shader 对象：一个顶点 shader，一个片元 shader，然后 program 对象被连接成“可执行文件”，这样就可以在 render 中是由该“可执行文件”了。

### 创建，装载和编译 shader

首先，我们向工程中添加新的类 GLESUtils，让它继承自 NSObject。修改 GLESUtils.h 为：

```objc
#import <Foundation/Foundation.h>
#include <OpenGLES/ES2/gl.h>

@interface GLESUtils : NSObject

// Create a shader object, load the shader source string, and compile the shader.
//
+(GLuint)loadShader:(GLenum)type withString:(NSString *)shaderString;

+(GLuint)loadShader:(GLenum)type withFilepath:(NSString *)shaderFilepath;

@end
```

修改 GLESUtils.m 为：

```objc
#import "GLESUtils.h"

@implementation GLESUtils

+(GLuint)loadShader:(GLenum)type withFilepath:(NSString *)shaderFilepath
{
    NSError* error;
    NSString* shaderString = [NSString stringWithContentsOfFile:shaderFilepath 
                                                       encoding:NSUTF8StringEncoding
                                                          error:&error];
    if (!shaderString) {
        NSLog(@"Error: loading shader file: %@ %@", shaderFilepath, error.localizedDescription);
        return 0;
    }
    
    return [self loadShader:type withString:shaderString];
}

+(GLuint)loadShader:(GLenum)type withString:(NSString *)shaderString
{   
    // Create the shader object
    GLuint shader = glCreateShader(type);
    if (shader == 0) {
        NSLog(@"Error: failed to create shader.");
        return 0;
    }
    
    // Load the shader source
    const char * shaderStringUTF8 = [shaderString UTF8String];
    glShaderSource(shader, 1, &shaderStringUTF8, NULL);
    
    // Compile the shader
    glCompileShader(shader);
    
    // Check the compile status
    GLint compiled = 0;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &compiled);
    
    if (!compiled) {
        GLint infoLen = 0;
        glGetShaderiv ( shader, GL_INFO_LOG_LENGTH, &infoLen );
        
        if (infoLen > 1) {
            char * infoLog = malloc(sizeof(char) * infoLen);
            glGetShaderInfoLog (shader, infoLen, NULL, infoLog);
            NSLog(@"Error compiling shader:\n%s\n", infoLog );            
            
            free(infoLog);
        }
        
        glDeleteShader(shader);
        return 0;
    }

    return shader;
}

@end
```

辅助类 GLESUtils 中有两个类方法用来跟进 shader 脚本字符串或 shader 脚本文件创建 shader，然后装载它，编译它。下面详细介绍每个步骤。

#### 创建/删除 shader

函数 glCreateShader 用来创建 shader，参数 GLenum type 表示我们要处理的 shader 类型，它可以是 GL_VERTEX_SHADER 或 GL_FRAGMENT_SHADER，分别表示顶点 shader 或 片元 shader。它返回一个句柄指向创建好的 shader 对象。

函数 glDeleteShader 用来销毁 shader，参数为 glCreateShader 返回的 shader 对象句柄。

#### 装载 shader

函数 glShaderSource 用来给指定 shader 提供 shader 源码。第一个参数是 shader 对象的句柄；第二个参数表示 shader 源码字符串的个数；第三个参数是 shader 源码字符串数组；第四个参数一个 int 数组，表示每个源码字符串应该取用的长度，如果该参数为 NULL，表示假定源码字符串是 \0 结尾的，读取该字符串的内容指定 \0 为止作为源码，如果该参数不是 NULL，则读取每个源码字符串中前 length（与每个字符串对应的 length）长度个字符作为源码。

#### 编译 shader

函数 glCompileShader 用来编译指定的 shader 对象，这将编译存储在 shader 对象中的源码。我们可以通过函数 glGetShaderiv 来查询 shader 对象的信息，如本例中查询编译情况，此外还可以查询 GL_DELETE_STATUS，GL_INFO_LOG_STATUS，GL_SHADER_SOURCE_LENGTH 和 GL_SHADER_TYPE。在这里我们查询编译情况，如果返回 0，表示编译出错了，错误信息会写入 info 日志中，我们可以查询该 info 日志，从而获得错误信息。

### 编写着色脚本

#### 添加顶点着色脚本

右击 Supporting Files 目录，New File->Other->Empty，输入名称：VertexShader.glsl。后缀glsl 表示 GL Shader Language。

编辑其内容如下：

```c
attribute vec4 vPosition; 
 
void main(void)
{
    gl_Position = vPosition;
}
```

顶点着色脚本的源码很简单，如果你仔细阅读了前面的介绍，就一目了然。 attribute 属性 vPosition 表示从应用程序输入的类型为 vec4 的位置信息，输出内建 vary 变量 vPosition。留意：这里使用了默认的精度。

#### 添加片元着色脚本

用于添加顶点着色脚本同样的方式添加名为 FragmentShader.glsl 的文件，编辑其内容如下：

```c
precision mediump float;

void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

片元着色脚本源码也很简单，前面说过片元着色要么自己定义默认精度，要么在每个变量前添加精度描述符，在这里自定义 float 的精度为 mediump。然后为内建输出变量 gl_FragColor 指定为红色。

### 创建 program，装配 shader，链接 program，使用 program

在 OpenGLView.h 的 OpenGLView 类声明中添加两个成员 _programHandle _positionSlot：

```objc
@interface OpenGLView (){
    EAGLContext* _context;
    CAEAGLLayer* _eaglLayer;
    GLuint _colorRenderBuffer;
    GLuint _frameBuffer;
    
    // 新添加的
    GLuint _programHandle;
    GLuint _positionSlot;
}
@end
```

添加setupProgram方法

```objc
- (void)setupProgram
{
    // Load shaders
    //
    NSString * vertexShaderPath = [[NSBundle mainBundle] pathForResource:@"VertexShader"
                                                                  ofType:@"glsl"];
    NSString * fragmentShaderPath = [[NSBundle mainBundle] pathForResource:@"FragmentShader"
                                                                    ofType:@"glsl"];
    GLuint vertexShader = [GLESUtils loadShader:GL_VERTEX_SHADER
                                   withFilepath:vertexShaderPath];
    GLuint fragmentShader = [GLESUtils loadShader:GL_FRAGMENT_SHADER
                                     withFilepath:fragmentShaderPath];
    
    // Create program, attach shaders.
    _programHandle = glCreateProgram();
    if (!_programHandle) {
        NSLog(@"Failed to create program.");
        return;
    }
    
    glAttachShader(_programHandle, vertexShader);
    glAttachShader(_programHandle, fragmentShader);
    
    // Link program
    //
    glLinkProgram(_programHandle);
    
    // Check the link status
    GLint linked;
    glGetProgramiv(_programHandle, GL_LINK_STATUS, &linked );
    if (!linked)
    {
        GLint infoLen = 0;
        glGetProgramiv (_programHandle, GL_INFO_LOG_LENGTH, &infoLen );
        
        if (infoLen > 1)
        {
            char * infoLog = malloc(sizeof(char) * infoLen);
            glGetProgramInfoLog (_programHandle, infoLen, NULL, infoLog );
            NSLog(@"Error linking program:\n%s\n", infoLog );
            
            free (infoLog );
        }
        
        glDeleteProgram(_programHandle);
        _programHandle = 0;
        return;
    }
    
    glUseProgram(_programHandle);
    
    // Get attribute slot from program
    //
    _positionSlot = glGetAttribLocation(_programHandle, "vPosition");
}
```

有了前面的介绍，上面的代码很容易理解。首先我们是由 GLESUtils 提供的辅助方法从前面创建的脚本中创建，装载和编译顶点 shader 和片元 shader；然后我们创建 program，将顶点 shader 和片元 shader 装配到 program 对象中，再使用 glLinkProgram 将装配的 shader 链接起来，这样两个 shader 就可以合作干活了。注意：链接过程会对 shader 进行可链接性检查，也就是前面说到同名变量必须同名同型以及变量个数不能超出范围等检查。我们如何检查 shader 编译情况一样，对 program 的链接情况进行检查。如果一切正确，那我们就可以调用 glUseProgram 激活 program 对象从而在 render 中使用它。通过调用 glGetAttribLocation 我们获取到 shader 中定义的变量 vPosition 在 program 的槽位，通过该槽位我们就可以对 vPosition 进行操作。

### 完善UIView

```objc
- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        [self setupLayer];
        [self setupContext];
        //新添加的
        [self setupProgram];
    }
    return self;
}
```

```objc
// 修改rander
- (void)render {
    glClearColor(0, 1.0, 0, 1.0);
    glClear(GL_COLOR_BUFFER_BIT);
    
    // Setup viewport
    //
    glViewport(0, 0, self.frame.size.width, self.frame.size.height);
    
    GLfloat vertices[] = {
        0.0f,  0.5f, 0.0f,
        -0.5f, -0.5f, 0.0f,
        0.5f,  -0.5f, 0.0f };
    
    // Load the vertex data
    //
    glVertexAttribPointer(_positionSlot, 3, GL_FLOAT, GL_FALSE, 0, vertices );
    glEnableVertexAttribArray(_positionSlot);
    
    // Draw triangle
    //
    glDrawArrays(GL_TRIANGLES, 0, 3);
    
    [_context presentRenderbuffer:GL_RENDERBUFFER];
}
```

在新增的代码中，第一句 glViewport 表示渲染 surface 将在屏幕上的哪个区域呈现出来，然后我们创建一个三角形顶点数组，通过 glVertexAttribPointer 将三角形顶点数据装载到 OpenGL ES 中并与 vPositon 关联起来，最后通过  glDrawArrays 将三角形图元渲染出来。

### 编译运行

编译运行，将看到一个红色的三角形显示在屏幕中央。知道为什么是红色的么？那是因为 program 也链接了片元着色器，在片元着色脚本文件中，我们指定 gl_FragColor 的值为红色 vec4(1.0, 0.0, 0.0, 1.0)。

{% asset_img shader-4.png %}


