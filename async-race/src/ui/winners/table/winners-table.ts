import { createCarImage } from '@components/svg-paint/create-car-image';
import { WINNERS_CAR_WIDTH, WINNERS_CAR_HEIGHT } from '@data/constants';
import { winnersState } from '@state/winners-state';
import { createElement } from '@utils/create-element';

import './winners-table.css';

export function createWinnersTable(): HTMLDivElement {
  const table = createElement({
    tag: 'div',
    className: ['winners-table'],
  });

  const header = createElement({ tag: 'div', className: ['winners-header'] });

  const headers = ['Position', 'Car', 'Name', 'Wins', 'Best Time (sec)'];

  headers.forEach((text) => {
    const cell = createElement({
      tag: 'div',
      className: ['winners-cell', 'header-cell'],
      textContent: text,
    });
    header.append(cell);
  });

  table.append(header);

  const winnersArray = Object.values(winnersState.winners);

  winnersArray.forEach((winner, index) => {
    const row = createElement({ tag: 'div', className: ['winners-row'] });
    const winnerCell = createElement({
      tag: 'div',
      className: ['winners-cell'],
      textContent: String(index + 1),
    });
    row.append(winnerCell);

    const car = createElement({ tag: 'div', className: ['winners-cell'] });
    const carIcon = createElement({
      tag: 'div',
      className: ['car-icon'],
    });

    const carSvg = createCarImage(winner.color, WINNERS_CAR_WIDTH, WINNERS_CAR_HEIGHT);
    carIcon.append(carSvg.element);

    car.append(carIcon);
    row.append(car);

    const name = createElement({
      tag: 'div',
      className: ['winners-cell'],
      textContent: winner.name,
    });
    row.append(name);

    const wins = createElement({
      tag: 'div',
      className: ['winners-cell'],
      textContent: String(winner.wins),
    });
    row.append(wins);

    const time = createElement({
      tag: 'div',
      className: ['winners-cell'],
      textContent: winner.time.toFixed(2),
    });
    row.append(time);

    table.append(row);
  });

  return table;
}
