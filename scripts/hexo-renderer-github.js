"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var keyv_file_1 = __importDefault(require("keyv-file"));
var axios = __importStar(require("axios"));
var keyv_1 = __importDefault(require("keyv"));
var probe_image_size_1 = __importDefault(require("probe-image-size"));
var keyv = new keyv_1.default({
    store: new keyv_file_1.default({
        expiredCheckDelay: 0,
        filename: "./cache/keyv-file.json",
    }),
});
function fetchImageSize(URL, from) {
    return __awaiter(this, void 0, Promise, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, probe_image_size_1.default)(URL)];
                case 1:
                    result = _a.sent();
                    // console.log(`FetchImageSize success [${[result.width, result.height]}]. repo: ${from} , image: ${URL}`);
                    return [2 /*return*/, [result.width, result.height]];
                case 2:
                    err_1 = _a.sent();
                    console.log("FetchImageSize error. repo: ".concat(from, " , image: ").concat(URL, " , error: ").concat(err_1));
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function httpGet(URL) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.default.get(URL, {
                        headers: {
                            "Authorization": "Basic dXNlcm5hbWU6Z2hwX21qd2hFeFNNaFVTTEpPMHJsNVQycXM4TzJMTkVacDNoMDBubA==",
                        },
                    })];
                case 1: 
                // Token
                return [2 /*return*/, (_a.sent())];
            }
        });
    });
}
function repoAPI(user, repoName) {
    return __awaiter(this, void 0, Promise, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "https://api.github.com/repos/".concat(user, "/").concat(repoName);
                    return [4 /*yield*/, httpGet(URL)];
                case 1:
                    response = _a.sent();
                    console.log("[".concat(response.headers["x-ratelimit-remaining"], "]Got Repo: https://github.com/").concat(user, "/").concat(repoName));
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function repoReadmeAPI(user, repoName) {
    return __awaiter(this, void 0, Promise, function () {
        var URL, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = "https://api.github.com/repos/".concat(user, "/").concat(repoName, "/readme");
                    return [4 /*yield*/, httpGet(URL)];
                case 1:
                    response = _a.sent();
                    console.log("[".concat(response.headers["x-ratelimit-remaining"], "]Got Readme: ").concat(repoName));
                    return [2 /*return*/, response.data];
            }
        });
    });
}
function fetchRepo(URL) {
    return __awaiter(this, void 0, Promise, function () {
        var repoURLRegExp, match, user, repoName, repoData, readmeData, readmeContent, imageURLs, markdownImageRegExp, imageURL, htmlImageRegExp, imageURL, imagesURLAndSize, nonNullImagesURLAndSize, images, repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repoURLRegExp = RegExp("^https:\/\/github\.com\/(.+?)\/(.+?)$");
                    match = URL.match(repoURLRegExp);
                    if (match == null) {
                        throw "match is null ".concat(URL);
                    }
                    if (match.length != 3) {
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
                    readmeContent = Buffer.from(readmeData["content"], "base64").toString("utf8");
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
                        if (!imageURL.startsWith("http")) {
                            var htmlURL = readmeData["html_url"];
                            var masterBranchRegExp = RegExp(/\/blob\/([^\/]+?)\/[^\/]+$/);
                            var matched = htmlURL.match(masterBranchRegExp);
                            if (matched == null || matched.length != 2) {
                                throw "htmlURL is wrong ".concat(htmlURL);
                            }
                            var branchName = matched[1];
                            imageURL =
                                "https://github.com/".concat(user, "/").concat(repoName, "/raw/").concat(branchName).concat(imageURL.startsWith("/") ? "" : "/") + imageURL;
                        }
                        if (!imageURL.includes("%")) {
                            imageURL = encodeURI(imageURL);
                        }
                        return imageURL;
                    });
                    return [4 /*yield*/, Promise.all(imageURLs.map(function (imageURL) {
                            return fetchImageSize(imageURL, URL).then(function (size) { return [imageURL, size]; });
                        }))];
                case 3:
                    imagesURLAndSize = _a.sent();
                    nonNullImagesURLAndSize = imagesURLAndSize.flatMap(function (e) { return e[1] != null ? [e] : []; });
                    nonNullImagesURLAndSize.sort(function (a, b) {
                        return b[1][0] * b[1][1] - a[1][0] * a[1][1];
                    });
                    images = imagesURLAndSize.slice(0, 3).map(function (e) { return e[0]; });
                    repo = {
                        user: repoData["owner"]["login"],
                        name: repoData["name"],
                        about: repoData["description"],
                        stars: repoData["stargazers_count"],
                        tags: repoData["topics"],
                        images: images,
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
                        throw "saved error";
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
                        repos: repos,
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
        starsAndTags += "    <".concat(repo.tags.join(", "), ">");
    }
    markdown += starsAndTags + "\n\n";
    // about
    if (repo.about) {
        markdown += "> ".concat(repo.about, "\n\n");
    }
    // image
    if (repo.images.length > 0) {
        markdown += "<details>\n<summary>Click to see images</summary>" + "\n\n";
        repo.images.forEach(function (imageURL) {
            // image lazy load
            markdown += "<p><img data-src=\"".concat(imageURL, "\" class=\"lazyload\"></p>\n\n");
            // markdown += `![](${imageURL})`
        });
        markdown += "</details>" + "\n\n";
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
        { value: 1e18, symbol: "E" },
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
}
function getMarkdownWithCategory(category) {
    var markdown = "";
    markdown += "## ".concat(category.name, "\n\n");
    category.repos.forEach(function (repo) {
        markdown += getMarkdownWithRepo(repo) + "\n\n";
    });
    return markdown;
}
function getMarkdownWithCategories(categories) {
    var markdown = "";
    categories.forEach(function (category) {
        markdown += getMarkdownWithCategory(category) + "\n\n";
    });
    return markdown;
}
hexo.extend.renderer.register("github", "html", function (data, options) {
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
                    htmlPromise = hexo.extend.renderer.get("md")
                        .call(hexo, {
                        text: markdown,
                        path: data.path,
                    }, options);
                    return [4 /*yield*/, htmlPromise];
                case 2:
                    html = _a.sent();
                    // image lazy load
                    html =
                        '<script src="https://afarkas.github.io/lazysizes/lazysizes.min.js" async=""></script>\n' +
                            html;
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
// request throttle
// https://stackoverflow.com/a/45460625/9315497
function scheduleRequests() {
    var lastInvocationTime;
    var scheduler = function (config) {
        var now = Date.now();
        if (lastInvocationTime) {
            lastInvocationTime += 100;
            var waitPeriodForThisRequest_1 = lastInvocationTime - now;
            if (waitPeriodForThisRequest_1 > 0) {
                return new Promise(function (resolve) {
                    setTimeout(function () { return resolve(config); }, waitPeriodForThisRequest_1);
                });
            }
        }
        lastInvocationTime = now;
        return config;
    };
    axios.default.interceptors.request.use(scheduler);
}
scheduleRequests();
//# sourceMappingURL=hexo-renderer-github.js.map