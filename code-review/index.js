/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/components/controller/loader.ts
var HttpMethods;
(function (HttpMethods) {
    HttpMethods["GET"] = "GET";
    HttpMethods["POST"] = "POST";
    HttpMethods["PUT"] = "PUT";
    HttpMethods["DELETE"] = "DELETE";
})(HttpMethods || (HttpMethods = {}));
class Loader {
    constructor(baseLink, options = {}) {
        this.baseLink = baseLink;
        this.options = options;
    }
    getResp({ endpoint, options = {} }, callback = () => {
        console.error('No callback for GET response');
    }) {
        this.load(HttpMethods.GET, endpoint, callback, options);
    }
    errorHandler(res) {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404) {
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
                throw Error(res.statusText);
            }
        }
        return res;
    }
    makeUrl(options, endpoint) {
        const urlOptions = Object.assign(Object.assign({}, this.options), options);
        let url = `${this.baseLink}${endpoint}?`;
        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });
        return url.slice(0, -1);
    }
    load(method, endpoint, callback, options = {}) {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}
/* harmony default export */ const loader = (Loader);

;// ./src/components/controller/appLoader.ts

class AppLoader extends loader {
    constructor() {
        var _a, _b;
        const apiUrl = (_a = "https://rss-news-api.onrender.com/") !== null && _a !== void 0 ? _a : '';
        const apiKey = (_b = "a3467a8729554d8c8b2341e49884499c") !== null && _b !== void 0 ? _b : '';
        super(apiUrl, { apiKey });
    }
}
/* harmony default export */ const appLoader = (AppLoader);

;// ./src/components/controller/controller.ts

class AppController extends appLoader {
    getSources(callback) {
        super.getResp({ endpoint: 'sources', options: {} }, callback);
    }
    getNews(e, callback) {
        let target = e.target;
        if (!(target instanceof HTMLElement))
            return;
        const newsContainer = e.currentTarget;
        if (!(newsContainer instanceof HTMLElement))
            return;
        while (target && target !== newsContainer) {
            if (target instanceof HTMLElement && target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (sourceId && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp({
                        endpoint: 'everything',
                        options: {
                            sources: sourceId,
                        },
                    }, callback);
                }
                return;
            }
            if (target instanceof HTMLElement) {
                target = target.parentElement;
            }
            else {
                return;
            }
        }
    }
}
/* harmony default export */ const controller = (AppController);

;// ./src/components/view/news/news.ts

class News {
    constructor() {
        this.AVAILABLE_NEWS = 10;
    }
    draw(data) {
        const news = data.length >= this.AVAILABLE_NEWS ? data.filter((_item, idx) => idx < this.AVAILABLE_NEWS) : data;
        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp');
        if (!newsItemTemp)
            return;
        news.forEach((item, idx) => {
            var _a, _b;
            const newsClone = document.importNode(newsItemTemp.content, true);
            const newsItem = newsClone.querySelector('.news__item');
            if (newsItem && idx % 2)
                newsItem.classList.add('alt');
            const photo = newsClone.querySelector('.news__meta-photo');
            if (photo) {
                photo.style.backgroundImage = `url(${(_a = item.urlToImage) !== null && _a !== void 0 ? _a : 'img/news_placeholder.jpg'})`;
            }
            const author = newsClone.querySelector('.news__meta-author');
            if (author) {
                author.textContent = (_b = item.author) !== null && _b !== void 0 ? _b : item.source.name;
            }
            const date = newsClone.querySelector('.news__meta-date');
            if (date) {
                date.textContent = item.publishedAt.slice(0, this.AVAILABLE_NEWS).split('-').reverse().join('-');
            }
            const title = newsClone.querySelector('.news__description-title');
            if (title) {
                title.textContent = item.title;
            }
            const source = newsClone.querySelector('.news__description-source');
            if (source) {
                source.textContent = item.source.name;
            }
            const content = newsClone.querySelector('.news__description-content');
            if (content) {
                content.textContent = item.description;
            }
            const readMore = newsClone.querySelector('.news__read-more a');
            if (readMore) {
                readMore.href = item.url;
            }
            fragment.append(newsClone);
        });
        const newsContainer = document.querySelector('.news');
        if (!newsContainer)
            return;
        newsContainer.innerHTML = '';
        newsContainer.appendChild(fragment);
    }
}
/* harmony default export */ const news = (News);

;// ./src/components/view/sources/sources.ts

class Sources {
    constructor() {
        this.allSources = [];
    }
    draw(data) {
        this.allSources = data;
        const wrapper = document.querySelector('.sources.buttons');
        if (!(wrapper instanceof HTMLElement))
            return;
        let searchContainer = wrapper.querySelector('.search-container');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.classList.add('search-container');
            const searchField = document.createElement('input');
            searchField.type = 'text';
            searchField.placeholder = 'Search...';
            searchField.classList.add('search');
            searchField.addEventListener('input', () => {
                this.filterSources(searchField.value);
            });
            searchContainer.append(searchField);
            wrapper.prepend(searchContainer);
        }
        let listContainer = wrapper.querySelector('.sources-list');
        if (!listContainer) {
            listContainer = document.createElement('div');
            listContainer.classList.add('sources-list');
            wrapper.append(listContainer);
        }
        this.createSources(this.allSources, listContainer);
    }
    createSources(data, container) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector('#sourceItemTemp');
        if (!(sourceItemTemp instanceof HTMLTemplateElement)) {
            return;
        }
        data.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);
            if (!(sourceClone instanceof DocumentFragment)) {
                return;
            }
            const sourceName = sourceClone.querySelector('.source__item-name');
            if (!(sourceName instanceof HTMLElement))
                return;
            sourceName.textContent = item.name;
            const sourceItem = sourceClone.querySelector('.source__item');
            if (!(sourceItem instanceof HTMLElement))
                return;
            sourceItem.setAttribute('data-source-id', String(item.id));
            fragment.append(sourceClone);
        });
        container.append(fragment);
    }
    filterSources(query) {
        const wrapper = document.querySelector('.sources.buttons');
        if (!(wrapper instanceof HTMLElement))
            return;
        const listContainer = wrapper.querySelector('.sources-list');
        if (!listContainer)
            return;
        const filtered = this.allSources.filter((source) => source.name.toLowerCase().includes(query.toLowerCase()));
        this.createSources(filtered, listContainer);
    }
}
/* harmony default export */ const sources = (Sources);

;// ./src/components/view/appView.ts


class AppView {
    constructor() {
        this.news = new news();
        this.sources = new sources();
    }
    drawNews(data) {
        const values = Array.isArray(data === null || data === void 0 ? void 0 : data.articles) ? data.articles : [];
        this.news.draw(values);
    }
    drawSources(data) {
        const values = Array.isArray(data === null || data === void 0 ? void 0 : data.sources) ? data.sources : [];
        this.sources.draw(values);
    }
}
/* harmony default export */ const appView = ((/* unused pure expression or super */ null && (AppView)));

;// ./src/components/app/app.ts


class App {
    constructor() {
        this.controller = new controller();
        this.view = new AppView();
    }
    start() {
        const sourcesContainer = document.querySelector('.sources');
        if (sourcesContainer instanceof HTMLElement) {
            sourcesContainer.addEventListener('click', (e) => {
                this.controller.getNews(e, (data) => this.view.drawNews(data));
            });
        }
        this.controller.getSources((data) => this.view.drawSources(data));
    }
}
/* harmony default export */ const app = (App);

;// ./src/index.ts


const src_app = new app();
src_app.start();

/******/ })()
;
//# sourceMappingURL=index.js.map