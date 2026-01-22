export const POPUP_MESSAGES = {
  carCreateFailed: (id?: number, name?: string): string =>
    id ? `Failed to create a new ${name ? ` (${name})` : ''} car.` : 'Failed to create a new car',

  carUpdateFailed: (): string => 'Failed to update the chosen car — try again.',

  carDeleteFailed: (id?: number, name?: string): string =>
    id
      ? `Failed to delete the ${name ? ` (${name})` : ''} car with ID ${id}.`
      : 'Failed to delete the chosen car',

  appLoadFailed: (): string => 'Failed to load the app',

  viewChangeFailed: (): string => 'Failed to change the view',

  navigationFailed: (): string => 'Failed to navigate to the selected view',

  garageLoadFailed: (): string => 'Failed to load the garage',

  winnersLoadFailed: (): string => 'Failed to load the winners',

  winnerCreateFailed: (name?: string): string =>
    name ? `Failed to create winner ${name}.` : 'Failed to create winner',

  winnerUpdateFailed: (name?: string): string =>
    name ? `Failed to create winner ${name}.` : 'Failed to create winner',

  randomCarsFailed: (): string => 'Failed to create 100 random cars',

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
