import { BAD_REQUEST, ERROR_RESPONSE, MANY_REQUESTS, SERVER_ERROR } from '@data/constants';

export function getApiError(status: number, id?: number): string {
  switch (status) {
    case BAD_REQUEST: {
      return 'Bad request';
    }
    case ERROR_RESPONSE: {
      return id ? `Item with id ${id} not found` : 'Not found';
    }
    case MANY_REQUESTS: {
      return 'Too many requests';
    }
    case SERVER_ERROR: {
      return 'Server error. The engine is broken down.';
    }
    default: {
      return `Unexpected error: ${status}`;
    }
  }
}
