"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var got_1 = __importDefault(require("got"));
var keyv_1 = __importDefault(require("keyv"));
var keyv_file_1 = __importDefault(require("keyv-file"));
var probe_image_size_1 = __importDefault(require("probe-image-size"));
var keyv = new keyv_1.default({
    store: new keyv_file_1.default({
        expiredCheckDelay: 0,
        filename: './cache/keyv-file.json'
    })
});
function fetchImageSize(URL, from) {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, probe_image_size_1.default)(URL)
                        // console.log(`FetchImageSize success [${[result.width, result.height]}]. repo: ${from} , image: ${URL}`);
                    ];
                case 1:
                    result = _a.sent();
                    // console.log(`FetchImageSize success [${[result.width, result.height]}]. repo: ${from} , image: ${URL}`);
                    return [2 /*return*/, [result.width, result.height]];
                case 2:
                    err_1 = _a.sent();
                    console.log("FetchImageSize error. repo: ".concat(from, " , image: ").concat(URL, " , error: ").concat(err_1));
                    return [2 /*return*/, [0, 0]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function httpGet(URL) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, got_1.default)(URL, {
                        headers: {
                            "Authorization": "Basic dXNlcm5hbWU6Z2hwX21qd2hFeFNNaFVTTEpPMHJsNVQycXM4TzJMTkVacDNoMDBubA=="
                        }
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function repoAPI(user, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "https://api.github.com/repos/".concat(user, "/").concat(repoName);
                    return [4 /*yield*/, httpGet(URL)];
                case 1:
                    response = _a.sent();
                    console.log("[".concat(response.headers['x-ratelimit-remaining'], "]Got Repo: https://github.com/").concat(user, "/").concat(repoName));
                    return [2 /*return*/, JSON.parse(response.body)];
            }
        });
    });
}
function repoReadmeAPI(user, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "https://api.github.com/repos/".concat(user, "/").concat(repoName, "/readme");
                    return [4 /*yield*/, httpGet(URL)];
                case 1:
                    response = _a.sent();
                    console.log("[".concat(response.headers['x-ratelimit-remaining'], "]Got Readme: ").concat(repoName));
                    return [2 /*return*/, JSON.parse(response.body)];
            }
        });
    });
}
function fetchRepo(URL) {
    return __awaiter(this, void 0, void 0, function () {
        var repoURLRegExp, match, user, repoName, repoData, readmeData, readmeContent, imageURLs, markdownImageRegExp, imageURL, htmlImageRegExp, imageURL, imagesURLAndSize, images, repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repoURLRegExp = RegExp('^https:\/\/github\.com\/(.+?)\/(.+?)$');
                    match = URL.match(repoURLRegExp);
                    if (match == null || match.length != 3) {
                        throw "URL is wrong ".concat(URL);
                    }
                    user = match[1];
                    repoName = match[2];
                    return [4 /*yield*/, repoAPI(user, repoName)];
                case 1:
                    repoData = _a.sent();
                    return [4 /*yield*/, repoReadmeAPI(user, repoName)];
                case 2:
                    readmeData = _a.sent();
                    readmeContent = Buffer.from(readmeData['content'], 'base64').toString('utf8');
                    imageURLs = [];
                    markdownImageRegExp = RegExp(/!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/gm);
                    match = markdownImageRegExp.exec(readmeContent);
                    while (match != null) {
                        imageURL = match[1].trim();
                        imageURLs.push(imageURL);
                        match = markdownImageRegExp.exec(readmeContent);
                    }
                    htmlImageRegExp = RegExp(/<img[^>]+src *= *["|']([^">']+)["|']/gm);
                    match = htmlImageRegExp.exec(readmeContent);
                    while (match != null) {
                        imageURL = match[1].trim();
                        imageURLs.push(imageURL);
                        match = htmlImageRegExp.exec(readmeContent);
                    }
                    // convert
                    imageURLs = imageURLs.map(function (imageURL) {
                        if (!imageURL.startsWith('http')) {
                            var htmlURL = readmeData['html_url'];
                            var masterBranchRegExp = RegExp(/\/blob\/([^\/]+?)\/[^\/]+$/);
                            var matched = htmlURL.match(masterBranchRegExp);
                            if (matched == null || matched.length != 2) {
                                throw "htmlURL is wrong ".concat(htmlURL);
                            }
                            var branchName = matched[1];
                            imageURL = "https://github.com/".concat(user, "/").concat(repoName, "/raw/").concat(branchName).concat(imageURL.startsWith('/') ? '' : '/') + imageURL;
                        }
                        if (!imageURL.includes('%')) {
                            imageURL = encodeURI(imageURL);
                        }
                        return imageURL;
                    });
                    return [4 /*yield*/, Promise.all(imageURLs.map(function (imageURL) { return fetchImageSize(imageURL, URL).then(function (size) { return [imageURL, size]; }); }))];
                case 3:
                    imagesURLAndSize = _a.sent();
                    imagesURLAndSize = imagesURLAndSize.filter(function (e) { return e[1] != null; });
                    imagesURLAndSize.sort(function (a, b) {
                        return b[1][0] * b[1][1] - a[1][0] * a[1][1];
                    });
                    images = imagesURLAndSize.slice(0, 3).map(function (e) { return e[0]; });
                    repo = {
                        user: repoData['owner']['login'],
                        name: repoData['name'],
                        about: repoData['description'],
                        stars: repoData['stargazers_count'],
                        tags: repoData['topics'],
                        images: images
                    };
                    return [2 /*return*/, repo];
            }
        });
    });
}
function generateRepo(URL) {
    return __awaiter(this, void 0, void 0, function () {
        var repoInCache, repo, saved;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, keyv.get(URL)];
                case 1:
                    repoInCache = _a.sent();
                    if (repoInCache) {
                        return [2 /*return*/, repoInCache];
                    }
                    return [4 /*yield*/, fetchRepo(URL)];
                case 2:
                    repo = _a.sent();
                    return [4 /*yield*/, keyv.set(URL, repo)];
                case 3:
                    saved = _a.sent();
                    if (!saved) {
                        throw 'saved error';
                    }
                    return [2 /*return*/, repo];
            }
        });
    });
}
function generateCategories(categoryConfigs) {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, categoryConfigs_1, categoryConfig, repos, _a, _b, URL_1, repo, error_1, category;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    categories = [];
                    _i = 0, categoryConfigs_1 = categoryConfigs;
                    _c.label = 1;
                case 1:
                    if (!(_i < categoryConfigs_1.length)) return [3 /*break*/, 9];
                    categoryConfig = categoryConfigs_1[_i];
                    repos = [];
                    _a = 0, _b = categoryConfig.repos;
                    _c.label = 2;
                case 2:
                    if (!(_a < _b.length)) return [3 /*break*/, 7];
                    URL_1 = _b[_a];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, generateRepo(URL_1)];
                case 4:
                    repo = _c.sent();
                    repos.push(repo);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.log("Github API. Repo: ".concat(URL_1, " error: ").concat(error_1));
                    return [3 /*break*/, 6];
                case 6:
                    _a++;
                    return [3 /*break*/, 2];
                case 7:
                    repos = repos.sort(function (a, b) {
                        return b.stars - a.stars;
                    });
                    category = {
                        name: categoryConfig.category,
                        repos: repos
                    };
                    categories.push(category);
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9: return [2 /*return*/, categories];
            }
        });
    });
}
function getRepoURL(user, name) {
    return "https://github.com/".concat(user, "/").concat(name);
}
function getMarkdownWithRepo(repo) {
    var markdown = "";
    // name
    markdown += "### [".concat(repo.name, "](").concat(getRepoURL(repo.user, repo.name), ")\n\n");
    // stars and tags
    var starsAndTags = "stars: ".concat(nFormatter(repo.stars, 1));
    if (repo.tags.length > 0) {
        starsAndTags += "    <".concat(repo.tags.join(', '), ">");
    }
    markdown += starsAndTags + '\n\n';
    // about
    if (repo.about) {
        markdown += "> ".concat(repo.about, "\n\n");
    }
    // image
    if (repo.images.length > 0) {
        markdown += '<details>\n<summary>Click to see images</summary>' + '\n\n';
        repo.images.forEach(function (imageURL) {
            // image lazy load
            markdown += "<p><img data-src=\"".concat(imageURL, "\" class=\"lazyload\"></p>\n\n");
            // markdown += `![](${imageURL})`
        });
        markdown += '</details>' + '\n\n';
    }
    return markdown;
}
function nFormatter(num, digits) {
    var lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}
function getMarkdownWithCategory(category) {
    var markdown = "";
    markdown += "## ".concat(category.name, "\n\n");
    category.repos.forEach(function (repo) {
        markdown += getMarkdownWithRepo(repo) + '\n\n';
    });
    return markdown;
}
function getMarkdownWithCategories(categories) {
    var markdown = "";
    categories.forEach(function (category) {
        markdown += getMarkdownWithCategory(category) + '\n\n';
    });
    return markdown;
}
hexo.extend.renderer.register('github', 'html', function (data, options) {
    return __awaiter(this, void 0, void 0, function () {
        var json, categoryConfigs, categories, markdown, htmlPromise, html, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    json = data.text.replace(/---.*?---/s, "");
                    categoryConfigs = JSON.parse(json);
                    return [4 /*yield*/, generateCategories(categoryConfigs)];
                case 1:
                    categories = _a.sent();
                    markdown = getMarkdownWithCategories(categories);
                    htmlPromise = hexo.extend.renderer.get('md').call(hexo, {
                        text: markdown,
                        path: data.path
                    }, options);
                    return [4 /*yield*/, htmlPromise
                        // image lazy load
                    ];
                case 2:
                    html = _a.sent();
                    // image lazy load
                    html = '<script src="https://afarkas.github.io/lazysizes/lazysizes.min.js" async=""></script>\n' + html;
                    return [2 /*return*/, html];
                case 3:
                    error_2 = _a.sent();
                    console.log("Fatal: ".concat(error_2));
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGV4by1yZW5kZXJlci1naXRodWIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvaGV4by1yZW5kZXJlci1naXRodWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBc0I7QUFDdEIsOENBQXdCO0FBQ3hCLHdEQUFpQztBQUNqQyxzRUFBb0M7QUFxQnBDLElBQU0sSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDO0lBQ2xCLEtBQUssRUFBRSxJQUFJLG1CQUFRLENBQUM7UUFDaEIsaUJBQWlCLEVBQUUsQ0FBQztRQUNwQixRQUFRLEVBQUUsd0JBQXdCO0tBQ3JDLENBQUM7Q0FDTCxDQUFDLENBQUE7QUFFRixTQUFlLGNBQWMsQ0FBQyxHQUFXLEVBQUUsSUFBWTs7Ozs7OztvQkFFbEMscUJBQU0sSUFBQSwwQkFBSyxFQUFDLEdBQUcsQ0FBQzt3QkFDN0IsMkdBQTJHO3NCQUQ5RTs7b0JBQXpCLE1BQU0sR0FBRyxTQUFnQjtvQkFDN0IsMkdBQTJHO29CQUMzRyxzQkFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFBOzs7b0JBRXBDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQStCLElBQUksdUJBQWEsR0FBRyx1QkFBYSxLQUFHLENBQUUsQ0FBQyxDQUFDO29CQUNuRixzQkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQTs7Ozs7Q0FFcEI7QUFFRCxTQUFlLE9BQU8sQ0FBQyxHQUFXOzs7O3dCQUN2QixxQkFBTSxJQUFBLGFBQUcsRUFBQyxHQUFHLEVBQUU7d0JBQ2xCLE9BQU8sRUFBRTs0QkFDTCxlQUFlLEVBQUUsNEVBQTRFO3lCQUNoRztxQkFDSixDQUFDLEVBQUE7d0JBSkYsc0JBQU8sU0FJTCxFQUFBOzs7O0NBQ0w7QUFFRCxTQUFlLE9BQU8sQ0FBQyxJQUFZLEVBQUUsUUFBZ0I7Ozs7Oztv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