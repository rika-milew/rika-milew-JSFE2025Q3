import { createCar } from '@api/garage/create-car';
import { generateCarName } from '@utils/generate-cars/generate-car-name';
import { generateColor } from '@utils/generate-cars/generate-color';

const CAR_QUANTITY = 100;

export async function createRandomCars(quantity = CAR_QUANTITY): Promise<void> {
  const requests: Promise<unknown>[] = [];
  const carNames = new Set<string>();

  for (let index = 0; index < quantity; index++) {
    let name: string;

    do {
      name = generateCarName();
    } while (carNames.has(name));

    const color = generateColor();
    requests.push(createCar(name, color));
  }

  await Promise.all(requests);
}
