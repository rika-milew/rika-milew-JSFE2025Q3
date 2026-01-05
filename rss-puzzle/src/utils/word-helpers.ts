export function shuffleWords<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let index = shuffledArray.length - 1; index > 0; index--) {
    const newIndex = Math.floor(Math.random() * (index + 1));
    [shuffledArray[index], shuffledArray[newIndex]] = [
      shuffledArray[newIndex],
      shuffledArray[index],
    ];
  }

  return shuffledArray;
}

export function fixWordWidth(wordWrapper: HTMLElement): void {
  const width = wordWrapper.getBoundingClientRect().width;
  wordWrapper.style.width = `${width}px`;
  wordWrapper.style.flex = '0 0 auto';
}
