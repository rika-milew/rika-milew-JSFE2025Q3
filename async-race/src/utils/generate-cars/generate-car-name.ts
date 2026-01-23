import { carBrands } from '@/data/car-models';

export function generateCarName(): string {
  const carBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
  const model = carBrand.models[Math.floor(Math.random() * carBrand.models.length)];

  return `${carBrand.brand} ${model}`;
}
