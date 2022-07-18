import got from "got";
import Keyv from "keyv";
import KeyvFile from "keyv-file";
import probe from "probe-image-size"

interface CategoryConfig {
    category: string
    repos: string[]
}

interface Repo {
    user: string
    name: string
    about: string
    stars: number
    tags: string[]
    images: string[]
}

interface Category {
    name: string
    repos: Repo[]
}

interface ImageSource {
    repo: string
    originalURL: string
    URL: string
}

class ImageSizeResult {
    image: ImageSource
    error: string | null
    size: [number, number] | null

    constructor(image: ImageSource, error: string | null, size: [number, number] | null) {
        this.image = image
        this.error = error
        this.size = size
    }

    static fromError(image: ImageSource, error: string): ImageSizeResult {
        return new ImageSizeResult(image, error, null)
    }

    static fromSize(image: ImageSource, size: [number, number]): ImageSizeResult {
        return new ImageSizeResult(image, null, size)
    }
}

class Analyzer {
    // repo
    numberOfRepoFromAPI: number = 0
    numberOfRepoFromCache: number = 0
    get numberOfRepo() { return this.numberOfRepoFromAPI + this.numberOfRepoFromCache }

    // readme
    numberOfSucceedReadmeFromAPI: number = 0
    failedReadmeAPI: {
        repo: string
        readmeURL: string
    }[] = []
    get numberOfFailedReadmeFromAPI() { return this.failedReadmeAPI.length }
    get numberOfReadmeFromAPI() { return this.numberOfSucceedReadmeFromAPI + this.numberOfFailedReadmeFromAPI }
    numberOfReadmeFromCache: number = 0
    get numberOfReadme() { return this.numberOfReadmeFromAPI + this.numberOfReadmeFromCache }

    // images
    numberOfSucceedImagesFromNetwork: number = 0
    failedImagesFromNetwork: Map<string, ImageSource[]> = new Map()
    get numberOfFailedImagesFromNetwork() { return Array.from(this.failedImagesFromNetwork.values()).reduce((previousValue, currentValue) => previousValue + currentValue.length, 0) }
    get numberOfImagesFromNetwork() { return this.numberOfSucceedImagesFromNetwork + this.numberOfFailedImagesFromNetwork }

    numberOfSucceedImagesFromCache: number = 0
    failedImagesFromCache: Map<string, ImageSource[]> = new Map()
    get numberOfFailedImagesFromCache() { return Array.from(this.failedImagesFromCache.values()).reduce((previousValue, currentValue) => previousValue + currentValue.length, 0) }
    get numberOfImagesFromCache() { return this.numberOfSucceedImagesFromCache + this.numberOfFailedImagesFromCache }

    get numberOfImages() { return this.numberOfImagesFromNetwork + this.numberOfImagesFromCache }
}

const analyzer = new Analyzer()

const keyv = new Keyv({
    store: new KeyvFile({
        expiredCheckDelay: 0,
        filename: './cache/keyv-file.json'
    })
})

async function fetchImageSize(imageSource: ImageSource): Promise<ImageSizeResult> {
    let dataInCache = await keyv.get(imageSource.URL) as ImageSizeResult | null
    if (dataInCache != null) {
        if (dataInCache.error != null) {
            let array = analyzer.failedImagesFromCache.get(dataInCache.error)
            if (array == null) {
                array = []
                analyzer.failedImagesFromCache.set(dataInCache.error, array)
            }
            array.push(imageSource)
        } else {
            analyzer.numberOfSucceedImagesFromCache += 1
        }
        return dataInCache
    }
    let size: ImageSizeResult
    try {
        let result = await probe(imageSource.URL)
        size = ImageSizeResult.fromSize(imageSource, [result.width, result.height])
        analyzer.numberOfSucceedImagesFromNetwork += 1
    } catch (err) {
        if (imageSource.URL != imageSource.originalURL) {
            try {
                await probe(imageSource.originalURL)
                exit(`Original image URL (${imageSource.originalURL}) works but transformed URL (${imageSource.URL}) is wrong. repo: ${imageSource.repo}`)
            } catch (error) { }
        }
        let array = analyzer.failedImagesFromNetwork.get(`${err}`)
        if (array == null) {
            array = []
            analyzer.failedImagesFromNetwork.set(`${err}`, array)
        }
        array.push(imageSource)
        size = ImageSizeResult.fromError(imageSource, `${err}`)
    }
    let saved = await keyv.set(imageSource.URL, size, 365 * 24 * 60 * 60) // 1 year
    if (!saved) {
        exit('keyv save error')
    }
    return size
}

async function httpGet(URL: string) {
    let response = await got(URL, {
        headers: {
            "Authorization": "Basic dXNlcm5hbWU6Z2hwX21qd2hFeFNNaFVTTEpPMHJsNVQycXM4TzJMTkVacDNoMDBubA=="
        }
    })
    console.log(`[${response.headers['x-ratelimit-remaining']}] Got: ${URL}`);
    return JSON.parse(response.body);
}

// seconds
function cacheExpiry(repoData: any) {
    let update = (new Date(repoData['pushed_at'])).getTime()
    let now = Date.now()
    let months = (now - update) / 1000 / 60 / 60 / 24 / 30
    if (months < 1) {
        return 1 * 24 * 60 * 60 // 1 day
    } else if (months < 12) {
        return 30 * 24 * 60 * 60 // 30 day
    } else if (months < 24) {
        return 365 / 2 * 24 * 60 * 60 // half year
    } else {
        return 365 * 24 * 60 * 60 // 1 year
    }
}

async function cache(key: string, value: any, repoData: any) {
    let seconds = cacheExpiry(repoData)
    let saved = await keyv.set(key, value, seconds * 1000)
    if (!saved) {
        exit('keyv save error')
    }
}

async function repoAPI(user: string, repoName: string) {
    let URL = `https://api.github.com/repos/${user}/${repoName}`
    let dataInCache = await keyv.get(URL)
    if (dataInCache != null) {
        analyzer.numberOfRepoFromCache += 1
        return dataInCache
    }
    try {
        let data = await httpGet(URL)
        analyzer.numberOfRepoFromAPI += 1
        await cache(URL, data, data)
        return data
    } catch (error) {
        exit(error)
    }
}

async function repoReadmeAPI(user: string, repoName: string, repoData: any) {
    let URL = `https://api.github.com/repos/${user}/${repoName}/readme`
    let dataInCache = await keyv.get(URL)
    if (dataInCache != null) {
        analyzer.numberOfReadmeFromCache += 1
        return dataInCache
    }

    try {
        let data = await httpGet(URL)
        analyzer.numberOfSucceedReadmeFromAPI += 1
        await cache(URL, data, repoData)
        return data
    } catch (error) {
        analyzer.failedReadmeAPI.push({
            repo: `https://github.com/${user}/${repoName}`,
            readmeURL: URL
        })
        return null
    }
}

var fetchedRepo: string[] = []

async function fetchRepo(URL: string): Promise<Repo> {
    if (fetchedRepo.includes(URL)) {
        throw new Error(`Duplicated repo: ${URL}`);
    }
    fetchedRepo.push(URL)
    const repoURLRegExp = RegExp('^https:\/\/github\.com\/(.+?)\/(.+?)$')
    var match = URL.match(repoURLRegExp);
    if (match == null || match.length != 3) {
        throw `[Internal] URL is wrong ${URL}`
    }
    let user = match[1]
    let repoName = match[2]
    let repoData = await repoAPI(user, repoName)
    let readmeData = await repoReadmeAPI(user, repoName, repoData)
    let readmeContent = readmeData == null ? "" : Buffer.from(readmeData['content'], 'base64').toString('utf8')

    // get images
    const imageURLs = new Set<string>()
    const markdownImageRegExp = RegExp(/!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/gm)
    match = markdownImageRegExp.exec(readmeContent);
    while (match != null) {
        let imageURL = match[1].trim()
        imageURLs.add(imageURL)
        match = markdownImageRegExp.exec(readmeContent);
    }
    const htmlImageRegExp = RegExp(/<img[^>]+src *= *["|']([^">']+)["|']/gm)
    match = htmlImageRegExp.exec(readmeContent);
    while (match != null) {
        let imageURL = match[1].trim()
        imageURLs.add(imageURL)
        match = htmlImageRegExp.exec(readmeContent);
    }

    // convert
    const imageSources = Array.from(imageURLs).map(imageURL => {
        let originalURL = imageURL
        if (!imageURL.startsWith('http')) {
            let htmlURL: string = readmeData['html_url']
            const masterBranchRegExp = RegExp(/\/blob\/([^\/]+?)\/[^\/]+$/)
            let matched = htmlURL.match(masterBranchRegExp);
            if (matched == null || matched.length != 2) {
                throw `[Internal] htmlURL is wrong ${htmlURL}`
            }
            let branchName = matched[1]
            imageURL = `https://github.com/${user}/${repoName}/raw/${branchName}${imageURL.startsWith('/') ? '' : '/'}` + imageURL
        }
        const regExpURLTransferBlobToRaw = RegExp(/(https:\/\/github\.com\/.*?\/.*?\/)blob/)
        if (imageURL.match(regExpURLTransferBlobToRaw)) {
            imageURL = imageURL.replace(regExpURLTransferBlobToRaw, "$1raw")
        }
        const imageSource = { originalURL: originalURL, URL: imageURL, repo: URL } as ImageSource
        return imageSource
    })

    // size sort
    var imageSizeResult = await Promise.all<ImageSizeResult>(
        imageSources.map(
            imageSource => fetchImageSize(imageSource)
        )
    )
    imageSizeResult = imageSizeResult.filter(e => e.error == null && e.size![0] > 50 && e.size![1] > 50)
    imageSizeResult.sort((a, b) => {
        return b.size![0] * b.size![1] - a.size![0] * a.size![1]
    })

    // model
    let images = imageSizeResult.slice(0, 3).map(e => e.image.URL)
    let repo: Repo = {
        user: repoData['owner']['login'],
        name: repoData['name'],
        about: repoData['description'],
        stars: repoData['stargazers_count'],
        tags: repoData['topics'],
        images: images
    }
    return repo
}

async function generateCategories(categoryConfigs: CategoryConfig[]) {
    var categories: Category[] = []
    for (let categoryConfig of categoryConfigs) {
        var repos: Repo[] = []
        for (const URL of categoryConfig.repos) {
            let repo = await fetchRepo(URL);
            repos.push(repo)
        }
        repos = repos.sort(function (a, b) {
            return b.stars - a.stars;
        });
        var category = {
            name: categoryConfig.category,
            repos: repos
        } as Category;
        categories.push(category)
    }
    return categories
}

function getMarkdownWithRepo(repo: Repo) {
    let markdown = ""

    // name
    markdown += `### [${repo.name}](https://github.com/${repo.user}/${repo.name})\n\n`

    // stars and tags
    let starsAndTags = `stars: ${nFormatter(repo.stars, 1)}`
    if (repo.tags.length > 0) {
        starsAndTags += `    <${repo.tags.join(', ')}>`
    }
    markdown += starsAndTags + '\n\n'

    // about
    if (repo.about) {
        markdown += `> ${repo.about}\n\n`
    }

    // image
    if (repo.images.length > 0) {
        markdown += '<details>\n<summary>Click to see images</summary>' + '\n\n'
        repo.images.forEach(imageURL => {
            // image lazy load
            markdown += `<p><img data-src="${imageURL}" class="lazyload"></p>\n\n`
            // markdown += `![](${imageURL})`
        });
        markdown += '</details>' + '\n\n'
    }
    return markdown
}

function nFormatter(num: number, digits: number) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

function getMarkdownWithCategory(category: Category) {
    let markdown = ""
    markdown += `## ${category.name}\n\n`
    category.repos.forEach(repo => {
        markdown += getMarkdownWithRepo(repo) + '\n\n'
    })
    return markdown
}

function getMarkdownWithCategories(categories: Category[]) {
    let markdown = ""
    categories.forEach(category => {
        markdown += getMarkdownWithCategory(category) + '\n\n'
    });
    return markdown
}

function exit(error: any): never {
    console.log(`[Internal] exit: ${error}`)
    process.exit(1)
}

function logAnalyzer() {
    console.log(`\n////////////////  BEGIN Analyzer:  ////////////////`)
    console.log(`Repos total: ${analyzer.numberOfRepo}, from API: ${analyzer.numberOfRepoFromAPI}, from cache: ${analyzer.numberOfRepoFromCache}`)
    console.log(`Readme total: ${analyzer.numberOfReadme}, from API: ${analyzer.numberOfReadmeFromAPI}, from cache: ${analyzer.numberOfReadmeFromCache}, API success: ${analyzer.numberOfSucceedReadmeFromAPI}, API failed: ${analyzer.numberOfFailedReadmeFromAPI}`)
    console.log(`Failed readme: \n${analyzer.failedReadmeAPI.map(e => `  repo: ${e.repo}, readme: ${e.readmeURL}`).join('\n')}`)
    console.log(`Image total: ${analyzer.numberOfImages}, from network: ${analyzer.numberOfImagesFromNetwork} (successful: ${analyzer.numberOfSucceedImagesFromNetwork}, failed: ${analyzer.numberOfFailedImagesFromNetwork}), from cache: ${analyzer.numberOfImagesFromCache} (successful: ${analyzer.numberOfSucceedImagesFromCache}, failed: ${analyzer.numberOfFailedImagesFromCache})`)
    if (analyzer.failedImagesFromNetwork.size > 0) {
        console.log(`Failed images from Network: \n${Array.from(analyzer.failedImagesFromNetwork.entries()).map(e => `  ${e[0]}\n${e[1].map(e => `    repo: ${e.repo}, Url: ${e.URL}${e.originalURL == e.URL ? '' : `, originalURL: ${e.originalURL}`}`).join('\n')}`).join('\n')}`)
    }
    if (analyzer.failedImagesFromCache.size > 0) {
        console.log(`Failed images from Cache: \n${Array.from(analyzer.failedImagesFromCache.entries()).map(e => `  ${e[0]}\n${e[1].map(e => `    repo: ${e.repo}, Url: ${e.URL}${e.originalURL == e.URL ? '' : `, originalURL: ${e.originalURL}`}`).join('\n')}`).join('\n')}`)
    }
    console.log(`////////////////  END Analyzer:  ////////////////\n`)
}

var taskCount = 0

hexo.extend.renderer.register('github', 'html', async function (data, options) {
    taskCount += 1
    try {
        let json = data.text.replace(/---.*?---/s, "")
        let categoryConfigs: CategoryConfig[] = JSON.parse(json);
        let categories = await generateCategories(categoryConfigs)
        let markdown = getMarkdownWithCategories(categories)

        let htmlPromise: Promise<string> = (hexo.extend.renderer as any).get('md').call(hexo, {
            text: markdown,
            path: data.path
        }, options)

        let html = await htmlPromise
        // image lazy load
        html = '<script src="https://afarkas.github.io/lazysizes/lazysizes.min.js" async=""></script>\n' + html
        taskCount -= 1
        if (taskCount == 0) {
            logAnalyzer()
        }
        return html
    } catch (error) {
        exit(error)
    }
})
