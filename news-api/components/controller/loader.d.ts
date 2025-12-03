import type { GetResponse } from 'types';
export declare enum HttpMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
declare class Loader {
    private readonly baseLink;
    private readonly options;
    constructor(baseLink: string, options?: {
        [key: string]: string | number | boolean;
    });
    getResp<T>({ endpoint, options }: GetResponse, callback?: (data: T) => void): void;
    private errorHandler;
    private makeUrl;
    private load;
}
export default Loader;
//# sourceMappingURL=loader.d.ts.map