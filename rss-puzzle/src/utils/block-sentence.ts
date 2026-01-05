export function blockSentence(sentence: HTMLElement): void {
  sentence.classList.remove('sentence_active');
  sentence.classList.add('sentence_done');
  sentence.style.pointerEvents = 'none';
}
