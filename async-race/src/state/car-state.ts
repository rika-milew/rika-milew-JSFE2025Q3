import type { Car } from '@/types/types';

type EngineData = {
  velocity: number;
  distance: number;
};

type CarStateItem = Car & {
  currentPosition?: number;
  isDriving?: boolean;
  animationId?: number;
  lastEngine?: EngineData;
  trackDistance: number;
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
      currentPosition: 0,
      isMoving: false,
      trackDistance: 0,
    }));
    if (totalCount !== undefined) {
      this.totalCount = totalCount;
    }
  },

  add(car: Car): void {
    this.cars.push({
      ...car,
      currentPosition: 0,
      isDriving: false,
      trackDistance: 0,
    });
    this.totalCount += 1;
  },

  update(updatedCar: Car): void {
    const index = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      const saved = this.cars[index];
      this.cars[index] = {
        ...updatedCar,
        currentPosition: saved.currentPosition,
        isDriving: saved.isDriving,
        trackDistance: saved.trackDistance,
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
