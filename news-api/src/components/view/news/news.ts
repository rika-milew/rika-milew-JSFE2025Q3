import type { Article } from 'types';
import './news.css';

class News {
  private readonly AVAILABLE_NEWS: number = 10;

  draw(data: Article[]): void {
    const news = data.length >= this.AVAILABLE_NEWS ? data.filter((_item, idx) => idx < this.AVAILABLE_NEWS) : data;
    const fragment = document.createDocumentFragment();
    const newsItemTemp = document.querySelector<HTMLTemplateElement>('#newsItemTemp');
    if (!newsItemTemp) return;

    news.forEach((item, idx) => {
      const newsClone = document.importNode(newsItemTemp.content, true);

      const newsItem = newsClone.querySelector<HTMLElement>('.news__item');
      if (newsItem && idx % 2) newsItem.classList.add('alt');

      const photo = newsClone.querySelector<HTMLElement>('.news__meta-photo');
      if (photo) {
        photo.style.backgroundImage = `url(${item.urlToImage ?? 'img/news_placeholder.jpg'})`;
      }

      const author = newsClone.querySelector<HTMLElement>('.news__meta-author');
      if (author) {
        author.textContent = item.author ?? item.source.name;
      }

      const date = newsClone.querySelector<HTMLElement>('.news__meta-date');
      if (date) {
        date.textContent = item.publishedAt.slice(0, this.AVAILABLE_NEWS).split('-').reverse().join('-');
      }

      const title = newsClone.querySelector<HTMLElement>('.news__description-title');
      if (title) {
        title.textContent = item.title;
      }

      const source = newsClone.querySelector<HTMLElement>('.news__description-source');
      if (source) {
        source.textContent = item.source.name;
      }

      const content = newsClone.querySelector<HTMLElement>('.news__description-content');
      if (content) {
        content.textContent = item.description;
      }

      const readMore = newsClone.querySelector<HTMLAnchorElement>('.news__read-more a');
      if (readMore) {
        readMore.href = item.url;
      }

      fragment.append(newsClone);
    });

    const newsContainer = document.querySelector<HTMLElement>('.news');
    if (!newsContainer) return;
    newsContainer.innerHTML = '';
    newsContainer.appendChild(fragment);
  }
}

export default News;
