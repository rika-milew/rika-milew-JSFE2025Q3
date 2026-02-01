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
  renderEmpty: () => void;
  setPage: (page: number) => void;
};

export type WinnersList = {
  renderWinners: () => void;
  renderEmpty: () => void;
  setWinnersPage: (page: number) => void;
};

export type WinnerAddPayload = {
  id: number;
  name: string;
  color: string;
  time: number;
};

export type SoundTypes = 'race' | 'brake' | 'button';

export type AudioPlayer = {
  playSound: (id: SoundTypes) => void;
  stopSound: (id: SoundTypes) => void;
  stopAllSounds: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  playOnce: (id: SoundTypes) => void;
  playRaceLoop: () => void;
  stopRaceLoop: () => void;
};

export type SortingOrder = 'ascending' | 'descending' | 'none';

// state

export type AppState = {
  view: View;
  garagePage: number;
  winnersPage: number;
  perPage: number;
  winnersPerPage: number;
  garage: Car[];
  winners: Winner[];
  winnersSort: WinnersSort;

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

export type WinnersStateItem = Winner & { name: string; color: string };

export type WinnersStateType = {
  winners: Record<number, WinnersStateItem>;
  totalWinners: number;
  set(winners: WinnersStateItem[]): void;
  add(winner: WinnersStateItem): void;
  update(winner: WinnersStateItem): void;
  remove(id: number): void;
  getById(id: number): WinnersStateItem | undefined;
};

export type WinnersSort = {
  sorting: 'wins' | 'time';
  order: 'ascending' | 'descending';
};

export type WinnerView = {
  id: number;
  wins: number;
  time: number;
  name: string;
  color: string;
};

export type CarStore = {
  container: HTMLDivElement;
  svg: SVGElement;
  track: HTMLDivElement;
  trackLine: HTMLDivElement;
  finish: HTMLElement;
  animationId?: number;
};

export type EngineButtons = {
  startButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
};

export type EngineData = {
  velocity: number;
  distance: number;
};

export type CarStateItem = Car & {
  currentPosition?: number;
  isDriving?: boolean;
  animationId?: number;
  lastEngine?: EngineData;
  trackDistance: number;
};

export type CarState = {
  cars: CarStateItem[];
  totalCount: number;
  set(cars: Car[], totalCount?: number): void;
  add(car: Car): void;
  update(updatedCar: Car): void;
  remove(id: number): void;
  getById(id: number): CarStateItem | undefined;
  getAllOnCurrentPage(): CarStateItem[];
  winner: CarStateItem | undefined;
  isRacing: boolean;
  garageSessionId: number;
};

export type Cars = {
  cars: Car[];
  totalCount: number;
};

export type PopupMessages = {
  carCreateFailed: (id?: number, name?: string) => string;
  carUpdateFailed: () => string;
  carDeleteFailed: (id?: number, name?: string) => string;
  carFormFailed: () => string;
  appLoadFailed: () => string;
  viewChangeFailed: () => string;
  navigationFailed: () => string;
  garageLoadFailed: () => string;
  winnersLoadFailed: () => string;
  winnerCreateFailed: (name?: string) => string;
  winnerUpdateFailed: (name?: string) => string;
  randomCarsFailed: () => string;
  carResetFailed: (id?: number, name?: string) => string;
  carStartFailed: (id?: number, name?: string) => string;
  carDriveFailed: (id?: number, name?: string) => string;
  generalError: string;
};

// api

export type DriveResponse = {
  success: boolean;
};

export type EngineResponse = {
  velocity: number;
  distance: number;
};

export type WinnersResponse = {
  winners: Winner[];
  totalWinners: number;
};
