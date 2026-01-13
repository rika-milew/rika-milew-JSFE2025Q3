export const carElements: Record<
  number,
  {
    container: HTMLDivElement;
    svg: SVGElement;
    track: HTMLDivElement;
    trackLine: HTMLDivElement;
    finish: HTMLElement;
    animationId?: number;
  }
> = {};
