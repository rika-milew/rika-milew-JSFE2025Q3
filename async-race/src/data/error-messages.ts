export const POPUP_MESSAGES = {
  carCreateFailed: (id?: number): string =>
    id ? `Failed to create a new car with id: ${id}` : 'Failed to create a new car',

  carUpdateFailed: (id?: number): string =>
    id ? `Failed to update the car with id: ${id}` : 'Failed to update the chosen car',

  carDeleteFailed: (id?: number): string =>
    id ? `Failed to delete the car with id: ${id}` : 'Failed to delete the chosen car',

  garageLoadFailed: (): string => 'Failed to load the garage',

  randomCarsFailed: (): string => 'Failed to create random cars',

  generalError: 'Something went wrong',
};
