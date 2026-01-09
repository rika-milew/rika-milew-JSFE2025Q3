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

export type PageInfoElements = {
  title: string;
  page: number;
  total: number;
  totalText: string;
};

export type PageInfoResults = {
  container: HTMLElement;
  totalInfo: HTMLElement;
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

export type CarForm = {
  submit?: (name: string, color: string) => void;
  carData?: { id: number; name: string; color: string };
  disabled?: boolean;
  isUpdate?: boolean;
};

export type GarageList = {
  container: HTMLDivElement;
  render: () => Promise<void>;
};
