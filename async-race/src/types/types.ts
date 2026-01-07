// elements

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

// app

export type View = 'garage' | 'winners';

export type AppState = {
  view: View;
  garagePage: number;
  winnersPage: number;
};

export type Car = {
  id: number;
  name: string;
  color: string;
};

export type Winner = {
  id: number;
  name: string;
  color: string;
  wins: number;
  time: number;
};
