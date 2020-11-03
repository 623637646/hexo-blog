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

async function fetchImageSize(URL: string, from: string): Promise<[number, number]> {
    try {
        let result = await probe(URL)
        // console.log(`FetchImageSize success [${[result.width, result.height]}]. repo: ${from} , image: ${URL}`);
        return [result.width, result.height]
    } catch (err) {
        console.log(`FetchImageSize error. repo: ${from} , image: ${URL} , error: ${err}`);
        return [0, 0]
    }
}

async function httpGet(URL: string) {
    return await got(URL, {
        headers: {
            "Authorization": "Basic dXNlcm5hbWU6Z2hwX21qd2hFeFNNaFVTTEpPMHJsNVQycXM4TzJMTkVacDNoMDBubA=="
        }
    })
}

async function repoAPI(user: string, repoName: string) {
    let URL = `https://api.github.com/repos/${user}/${repoName}`
    let response = await httpGet(URL)
    console.log(`[${response.headers['x-ratelimit-remaining']}]Got Repo: https://github.com/${user}/${repoName}`);
    return JSON.parse(response.body)
}

async function repoReadmeAPI(user: string, repoName: string) {
    let URL = `https://api.github.com/repos/${user}/${repoName}/readme`
    let response = await httpGet(URL)
    console.log(`[${response.headers['x-ratelimit-remaining']}]Got Readme: ${repoName}`);
    return JSON.parse(response.body)
}

async function fetchRepo(URL: string): Promise<Repo> {
    const repoURLRegExp = RegExp('^https:\/\/github\.com\/(.+?)\/(.+?)$')
    var match = URL.match(repoURLRegExp);
    if (match == null || match.length != 3) {
        throw `URL is wrong ${URL}`
    }
    let user = match[1]
    let repoName = match[2]
    let repoData = await repoAPI(user, repoName)
    let readmeData = await repoReadmeAPI(user, repoName)
    let readmeContent = Buffer.from(readmeData['content'], 'base64').toString('utf8')

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
        if (!imageURL.startsWith('http')) {
            let htmlURL: string = readmeData['html_url']
            const masterBranchRegExp = RegExp(/\/blob\/([^\/]+?)\/[^\/]+$/)
            let matched = htmlURL.match(masterBranchRegExp);
            if (matched == null || matched.length != 2) {
                throw `htmlURL is wrong ${htmlURL}`
            }
            let branchName = matched[1]
            imageURL = `https://github.com/${user}/${repoName}/raw/${branchName}${imageURL.startsWith('/') ? '' : '/'}` + imageURL
        }
        if (!imageURL.includes('%')) {
            imageURL = encodeURI(imageURL)
        }
        return imageURL
    })

    // size sort
    var imagesURLAndSize = await Promise.all<[string, [number, number]]>(
        imageURLs.map<Promise<[string, [number, number]]>>(
            imageURL => fetchImageSize(imageURL, URL).then(size => [imageURL, size])
        )
    )
    imagesURLAndSize = imagesURLAndSize.filter(e => e[1] != null)
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

async function generateRepo(URL: string) {
    let repoInCache = await keyv.get(URL) as Repo
    if (repoInCache) {
        return repoInCache
    }
    let repo = await fetchRepo(URL)
    let saved = await keyv.set(URL, repo)
    if (!saved) {
        throw 'saved error'
    }
    return repo
}

async function generateCategories(categoryConfigs: CategoryConfig[]) {
    var categories: Category[] = []
    for (let categoryConfig of categoryConfigs) {
        var repos: Repo[] = []
        for (const URL of categoryConfig.repos) {
            try {
                let repo = await generateRepo(URL);
                repos.push(repo)
            } catch (error) {
                console.log(`Github API. Repo: ${URL} error: ${error}`)
            }
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

function getRepoURL(user: string, name: string) {
    return `https://github.com/${user}/${name}`
}

function getMarkdownWithRepo(repo: Repo) {
    let markdown = ""

    // name
    markdown += `### [${repo.name}](${getRepoURL(repo.user, repo.name)})\n\n`

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
        // console.log(`\n[hexo-renderer-github] markdown log:\n/**\n\n${markdown}\n\n**/\n[hexo-renderer-github] markdown end\n`)

        let htmlPromise: Promise<string> = (hexo.extend.renderer as any).get('md').call(hexo, {
            text: markdown,
            path: data.path
        }, options)

        let html = await htmlPromise
        // image lazy load
        html = '<script src="https://afarkas.github.io/lazysizes/lazysizes.min.js" async=""></script>\n' + html
        return html
    } catch (error) {
        console.log(`Fatal: ${error}`)
        process.exit(1)
    }

})
