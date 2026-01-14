const MAX_COLOR = 0xff_ff_ff;
const HEX_RADIX = 16;
const HEX_LENGTH = 6;

export function generateColor(): string {
  return `#${Math.floor(Math.random() * MAX_COLOR)
    .toString(HEX_RADIX)
    .padStart(HEX_LENGTH, '0')}`;
}
