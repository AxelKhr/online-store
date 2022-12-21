import { ResponseCode } from "../enum/responseCode";
import { Callback } from "../interface/callback";
import { Request } from "../interface/request";

class Loader {

    private readonly baseLink: string;
    private readonly options: {limit: string};
    
    constructor(baseLink: string, options: {limit: string}) {
        this.baseLink = baseLink;
        this.options = options;
    }

    getResp<T>(
        req: Request,
        callback: Callback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load('GET', req.endpoint, callback, req.options ?? {});
    }

    errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === ResponseCode.Unauthorized || res.status === ResponseCode.NotFound)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }
    
    makeUrl(options: {sources?: string }, endpoint: string): string {
        const urlOptions: {[index: string]: string} = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;
        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });
        console.log(url.slice(0, -1))
        return url.slice(0, -1);
    }

    load<T>(method: string, endpoint: string, callback: Callback<T>, options: {sources?: string}): void {
        fetch(this.makeUrl(options, endpoint), {method})
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;