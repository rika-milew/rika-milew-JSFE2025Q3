import { generateCarName } from './generate-car-name';
import { generateRandomColor } from './generate-color';
import { createCar } from '../../api/garage/create-car';

const CAR_QUANTITY = 100;

export async function createRandomCars(quantity = CAR_QUANTITY): Promise<void> {
  const requests: Promise<unknown>[] = [];
  const carNames = new Set<string>();

  for (let index = 0; index < quantity; index++) {
    let name: string;

    do {
      name = generateCarName();
    } while (carNames.has(name));

    const color = generateRandomColor();
    requests.push(createCar(name, color));
  }

  await Promise.all(requests);
}
