type Route = {
    path: string;
    loader: (param: string) => void;
}

export class Router {

    private _routes: Array<Route>;

    constructor() {
        this._routes = [];
    }

    async locationHandler() {
        const search = (window.location.href.split('?')[1] || '');
        const path = window.location.hash.replace('#', '').replace(/\?(.*)$/, '').replace(/\/$/, '').replace(/^\//, '');
        const href = `${window.location.href.replace(/#(.*)$/, '')}#/${path}${(search.length) ? '?' + search : ''}`
        window.history.replaceState({}, '', href);
        const route = this.findRoute(path);
        if (route) {
            route.loader(search);
        } else {
            throw new Error();
        }
    };

    addRoute(path: string, loader: (params: string) => void) {
        this._routes.push({ path, loader });
    }

    findRoute = (url: string) => this._routes.find((route) => (url === route.path));
}

