import type { Car } from '@/types/types';

type CarStateItem = Car & {
  animationId?: number;
  currentPosition?: number;
  isDriving?: boolean;
};

type CarState = {
  cars: CarStateItem[];
  totalCount: number;
  set(cars: Car[], totalCount?: number): void;
  add(car: Car): void;
  update(updatedCar: Car): void;
  remove(id: number): void;
  getById(id: number): CarStateItem | undefined;
};

export const carState: CarState = {
  cars: [],
  totalCount: 0,

  set(cars: Car[], totalCount?: number): void {
    this.cars = cars.map((car) => ({
      ...car,
      animationId: undefined,
      currentPosition: 0,
      isMoving: false,
    }));
    if (totalCount !== undefined) {
      this.totalCount = totalCount;
    }
  },

  add(car: Car): void {
    this.cars.push({
      ...car,
      animationId: undefined,
      currentPosition: 0,
      isDriving: false,
    });
    this.totalCount += 1;
  },

  update(updatedCar: Car): void {
    const index = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      const saved = this.cars[index];
      this.cars[index] = {
        ...updatedCar,
        animationId: saved.animationId,
        currentPosition: saved.currentPosition,
        isDriving: saved.isDriving,
      };
    }
  },

  remove(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
    this.totalCount -= 1;
  },

  getById(id: number): CarStateItem | undefined {
    return this.cars.find((c) => c.id === id);
  },
};
