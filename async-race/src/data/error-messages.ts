export const POPUP_MESSAGES = {
  carCreateFailed: (id?: number, name?: string): string =>
    id ? `Failed to create a new ${name ? ` (${name})` : ''} car.` : 'Failed to create a new car',

  carUpdateFailed: (id?: number, name?: string): string =>
    id
      ? `Failed to update the ${name ? ` (${name})` : ''} car with ID ${id}.`
      : 'Failed to update the chosen car',

  carDeleteFailed: (id?: number, name?: string): string =>
    id
      ? `Failed to delete the ${name ? ` (${name})` : ''} car with ID ${id}.`
      : 'Failed to delete the chosen car',

  garageLoadFailed: (): string => 'Failed to load the garage',

  winnersLoadFailed: (): string => 'Failed to load the winners',

  randomCarsFailed: (): string => 'Failed to create random cars',

  carResetFailed: (id?: number, name?: string): string =>
    id
      ? `Failed to reset the ${name ? ` (${name})` : ''} car with ID ${id}.`
      : 'Failed to reset the chosen car',

  carStartFailed: (id?: number, name?: string): string =>
    id
      ? `Failed to start the ${name ? ` (${name})` : ''} car with ID ${id}.`
      : 'Failed to start the chosen car',

  carDriveFailed: (id?: number, name?: string): string =>
    id
      ? `The ${name ? ` (${name})` : ''} car (ID ${id}) has been stopped suddenly. It's engine was broken down.`
      : "Car with has been stopped suddenly. It's engine was broken down.",

  generalError: 'Something went wrong',
};
