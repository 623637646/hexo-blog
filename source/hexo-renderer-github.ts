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

const keyv = new Keyv({
    store: new KeyvFile({
        expiredCheckDelay: 0,
        filename: './cache/keyv-file.json'
    })
})

async function fetchImageSize(URL: string, repo: string): Promise<[number, number]> {
    let dataInCache = await keyv.get(URL) as [number, number] | null
    if (dataInCache != null) {
        console.log(`[FromCache] Image: ${URL}`);
        return dataInCache
    }
    let size: [number, number]
    try {
        let result = await probe(URL)
        size = [result.width, result.height]
    } catch (err) {
        console.log(`[FetchImageSize] error. image: ${URL} , repo: ${repo} , error: ${err}`);
        size = [0, 0]
    }
    let saved = await keyv.set(URL, size, 365 * 24 * 60 * 60) // 1 year
    if (!saved) {
        throw '[Internal] saved error'
    }
    return size
}

async function httpGet(URL: string) {
    try {
        let response = await got(URL, {
            headers: {
                "Authorization": "Basic dXNlcm5hbWU6Z2hwX21qd2hFeFNNaFVTTEpPMHJsNVQycXM4TzJMTkVacDNoMDBubA=="
            }
        })
        console.log(`[${response.headers['x-ratelimit-remaining']}] Got: ${URL}`);
        return JSON.parse(response.body);
    } catch (error) {
        throw `[API] eror! URL: ${URL} , error: ${error}`
    }
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

async function getFromCache(key: string) {
    let dataInCache = await keyv.get(key) as any
    if (dataInCache != null) {
        console.log(`[FromCache] Got: ${key}`);
        return dataInCache
    }
    return null
}

async function cache(key: string, value: any, repoData: any) {
    let seconds = cacheExpiry(repoData)
    let saved = await keyv.set(key, value, seconds * 1000)
    if (!saved) {
        throw '[Internal] saved error'
    }
    console.log(`[SaveCache][${seconds / 60 / 60 / 24}] ${key}`);
}

async function repoAPI(user: string, repoName: string) {
    let URL = `https://api.github.com/repos/${user}/${repoName}`
    let dataInCache = await getFromCache(URL)
    if (dataInCache != null) {
        return dataInCache
    }
    let data = await httpGet(URL)
    await cache(URL, data, data)
    return data
}

async function repoReadmeAPI(user: string, repoName: string, repoData: any) {
    let URL = `https://api.github.com/repos/${user}/${repoName}/readme`
    let dataInCache = await getFromCache(URL)
    if (dataInCache != null) {
        return dataInCache
    }

    let data: any
    try {
        data = await httpGet(URL)
    } catch (error) {
        console.log(`[API] Readme API error: ${error}`);
        data = null
    }

    if (data != null) {
        await cache(URL, data, repoData)
        return data
    } else {
        return null
    }
}

async function fetchRepo(URL: string): Promise<Repo> {
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
    var imageURLs: string[] = []
    const markdownImageRegExp = RegExp(/!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/gm)
    match = markdownImageRegExp.exec(readmeContent);
    while (match != null) {
        let imageURL = match[1].trim()
        imageURLs.push(imageURL)
        match = markdownImageRegExp.exec(readmeContent);
    }
    const htmlImageRegExp = RegExp(/<img[^>]+src *= *["|']([^">']+)["|']/gm)
    match = htmlImageRegExp.exec(readmeContent);
    while (match != null) {
        let imageURL = match[1].trim()
        imageURLs.push(imageURL)
        match = htmlImageRegExp.exec(readmeContent);
    }

    // convert
    imageURLs = imageURLs.map(imageURL => {
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
        imageURL = encodeURI(imageURL)
        if (originalURL != imageURL) {
            console.log(`[Image Transfer] Change image URL from ${originalURL} to ${imageURL}`)
        }
        return imageURL
    })

    // size sort
    var imagesURLAndSize = await Promise.all<[string, [number, number]]>(
        imageURLs.map<Promise<[string, [number, number]]>>(
            imageURL => fetchImageSize(imageURL, URL).then(size => [imageURL, size])
        )
    )
    imagesURLAndSize = imagesURLAndSize.filter(e => e[1][0] > 50 && e[1][1] > 50)
    imagesURLAndSize.sort((a, b) => {
        return b[1][0] * b[1][1] - a[1][0] * a[1][1]
    })

    // model
    let images = imagesURLAndSize.slice(0, 3).map(e => e[0])
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

hexo.extend.renderer.register('github', 'html', async function (data, options) {
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
        console.log(`Done!`)
        return html
    } catch (error) {
        console.log(`[Internal] exit: ${error}`)
        process.exit(1)
    }

})
