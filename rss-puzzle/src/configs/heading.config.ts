type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingConfig = {
  tag: HeadingTag;
  className: string;
};

export const HEADING_TEMPLATES = {
  startPage: {
    tag: 'h1' as const,
    className: 'start__heading',
  },
  gamePage: {
    tag: 'h2' as const,
    className: 'game__round',
  },
} as const;
