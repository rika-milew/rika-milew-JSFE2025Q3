import { SCREEN_WIDTH_499, SCREEN_WIDTH_595, SCREEN_WIDTH_768 } from '@/constants/constants';

export function getWinnerCarSize(): { width: number; height: number } {
  const screenWidth = window.innerWidth;

  if (screenWidth > SCREEN_WIDTH_768) {
    return { width: 70, height: 26 };
  } else if (screenWidth > SCREEN_WIDTH_595) {
    return { width: 60, height: 22 };
  } else if (screenWidth > SCREEN_WIDTH_499) {
    return { width: 50, height: 18 };
  } else {
    return { width: 60, height: 22 };
  }
}
