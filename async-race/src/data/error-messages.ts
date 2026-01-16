export const POPUP_MESSAGES = {
  carCreateFailed: (id?: number): string =>
    id ? `Failed to create a new car with id: ${id}` : 'Failed to create a new car',

  carUpdateFailed: (id?: number): string =>
    id ? `Failed to update the car with id: ${id}` : 'Failed to update the chosen car',

  carDeleteFailed: (id?: number): string =>
    id ? `Failed to delete the car with id: ${id}` : 'Failed to delete the chosen car',

  garageLoadFailed: (): string => 'Failed to load the garage',

  randomCarsFailed: (): string => 'Failed to create random cars',

  carResetFailed: (id?: number): string =>
    id ? `Failed to reset the car with id: ${id}` : 'Failed to reset the chosen car',

  carStartFailed: (id?: number): string =>
    id ? `Failed to start the car with id: ${id}` : 'Failed to start the chosen car',

  carDriveFailed: (id?: number): string =>
    id
      ? `Car with id ${id} has been stopped suddenly. It's engine was broken down.`
      : "Car with id  has been stopped suddenly. It's engine was broken down.",

  generalError: 'Something went wrong',
};
