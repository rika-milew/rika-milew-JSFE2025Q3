import { createCarImage } from '@components/svg-paint/create-car-image';
import { winnersState } from '@state/winners-state';
import { createElement } from '@utils/create-element';
import { getWinnerCarSize } from '@utils/get-winner-car-size';

import type { WinnersStateItem } from '@state/winners-state';

import './winners-table.css';

export function createWinnersTable(): HTMLDivElement {
  const table = createElement({ tag: 'div', className: ['winners-table'] });
  const headers = ['Position', 'Car', 'Name', 'Wins', 'Best Time (sec)'];

  table.append(createHeader(headers));

  const winnersArray = Object.values(winnersState.winners);
  winnersArray.forEach((winner, index) => {
    table.append(createWinnerRow(winner, index));
  });

  return table;
}

function createHeader(headers: string[]): HTMLDivElement {
  const header = createElement({ tag: 'div', className: ['winners-header'] });

  headers.forEach((text) => {
    const cell = createElement({
      tag: 'div',
      className: ['winners-cell', 'header-cell'],
      textContent: text,
    });
    header.append(cell);
  });

  return header;
}

function createCarCell(color: string): HTMLDivElement {
  const carCell = createElement({ tag: 'div', className: ['winners-cell', 'car-cell'] });
  const carIcon = createElement({ tag: 'div', className: ['car-icon'] });

  const { width, height } = getWinnerCarSize();
  const carSvg = createCarImage(color, width, height);

  carIcon.append(carSvg.element);
  carCell.append(carIcon);

  return carCell;
}

function createTextCell(text: string, label: string): HTMLDivElement {
  const cell = createElement({ tag: 'div', className: ['winners-cell'], textContent: text });
  cell.dataset.label = label;
  return cell;
}

function createWinnerRow(winner: WinnersStateItem, index: number): HTMLDivElement {
  const row = createElement({ tag: 'div', className: ['winners-row'] });

  row.append(createTextCell(String(index + 1), 'Position:'));
  row.append(createCarCell(winner.color));
  row.append(createTextCell(winner.name, 'Name:'));
  row.append(createTextCell(String(winner.wins), 'Wins:'));
  row.append(createTextCell(winner.time.toFixed(2), 'Best Time (sec):'));

  return row;
}
