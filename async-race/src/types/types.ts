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
  className?: string[];
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
  pageInfo: HTMLElement;
  totalInfo: HTMLElement;
};

export type CarFormElements = {
  carForm: HTMLFormElement;
  nameInput: HTMLInputElement;
  colorInput: HTMLInputElement;
  button: HTMLButtonElement;
  errorText: HTMLParagraphElement;
};

export type GarageButtons = {
  raceButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  generateButton: HTMLButtonElement;
};

export type PaginationElements = {
  paginationContainer: HTMLDivElement;
  previousButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
};

export type PaginationCallbacks = {
  onPrev: () => void;
  onNext: () => void;
};

export type PopupOptions = {
  overlayClass: string;
  containerClass: string;
  headingContent: string;
  imageSrc: string;
  imageAlt: string;
  animationDuration: number;
  messageContent?: (message: string) => string;
};

// app

export type AppRouter = {
  navigate: (view: View) => void;
};

export type ButtonConfig = {
  text: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export type View = 'garage' | 'winners';

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

export type CarSvg = {
  element: SVGElement;
  setColor: (color: string) => void;
};

export type CarBrand = {
  brand: string;
  models: string[];
};

export type GarageList = {
  render: () => void;
  setPage: (page: number) => void;
};

export type SoundTypes = 'race' | 'brake' | 'button';

export type AudioPlayer = {
  playSound: (id: SoundTypes) => void;
  stopSound: (id: SoundTypes) => void;
  stopAllSounds: () => void;
};

// state

export type AppState = {
  view: View;
  garagePage: number;
  winnersPage: number;
  perPage: number;
  garage: Car[];
  winners: Winner[];

  createForm: {
    name: string;
    color: string;
  };

  updateForm: {
    id: number | undefined;
    name: string;
    color: string;
    isDisabled: boolean;
  };
};

// api

export type DriveResponse = {
  success: boolean;
};

export type EngineResponse = {
  velocity: number;
  distance: number;
};
