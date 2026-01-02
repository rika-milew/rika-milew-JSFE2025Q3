export type HTMLElements = Pick<
  HTMLElementTagNameMap,
  | 'div'
  | 'input'
  | 'button'
  | 'form'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'a'
  | 'img'
  | 'ul'
  | 'ol'
  | 'li'
  | 'textarea'
  | 'select'
  | 'option'
  | 'label'
  | 'section'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
>;

export type ElementTag = keyof HTMLElements;

export type ElementOptions<K extends ElementTag> = {
  tag: K;
  className?: string | string[];
  textContent?: string;
  attributes?: Record<string, string>;
};

export type User = {
  firstName: string;
  surname: string;
};

// game

export type Word = {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
};

export type Level = {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
};

export type Round = {
  levelData: Level;
  words: Word[];
};

export type Game = {
  rounds: Round[];
};

export type Sentence = {
  textExample: string;
  textExampleTranslate: string;
  audioExample: string;
};

export type ImageInfo = {
  container: HTMLElement;
  title: HTMLElement;
  author: HTMLElement;
  year: HTMLElement;
};

// modal

export type ModalButton = {
  text: string;
  className?: string;
  onClick?: () => void;
};

export type ModalElements = {
  container: HTMLElement;
  content: HTMLElement;
  buttons: ModalButton[];
};
