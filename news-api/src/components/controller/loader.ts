import type { GetResponse } from 'types';

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class Loader {
  private readonly baseLink: string;
  private readonly options: Record<string, string | number | boolean>;

  constructor(baseLink: string, options: Record<string, string | number | boolean> = {}) {
    this.baseLink = baseLink;
    this.options = options;
  }

  getResp<T>(
    { endpoint, options = {} }: GetResponse,
    callback: (data: T) => void = () => {
      console.error('No callback for GET response');
    }
  ) {
    this.load(HttpMethods.GET, endpoint, callback, options);
  }

  private errorHandler(res: Response): Response {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404) {
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
        throw Error(res.statusText);
      }
    }

    return res;
  }

  private makeUrl(options: Record<string, string | number | boolean>, endpoint: string): string {
    const urlOptions = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}?`;

    Object.keys(urlOptions).forEach((key: string) => {
      url += `${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  private load<T>(
    method: HttpMethods,
    endpoint: string,
    callback: (data: T) => void,
    options: Record<string, string | number | boolean> = {}
  ): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res) => res.json() as Promise<T>)
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
}

export default Loader;
