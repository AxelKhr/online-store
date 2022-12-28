import { Route } from "../interface/route";

class Router {

    private _routes: Array<Route>;

    constructor() {
        this._routes = [];
    }

    async locationHandler() {
        console.log('locationHandler');
        const search = (window.location.href.split('?')[1] || '');
        let path: string = window.location.hash.replace('#', '').split('?')[0];
        if ((path.length == 0) || (path[path.length - 1] !== '/')) {
            path += '/';
            window.history.replaceState({}, '', window.location.origin + '#' + path);
        }
        const route = this.findRoute(path);
        if (route) {
            route.loader(search);
        } else {
            throw new Error('404');
        }
    };

    addRoute(path: string, title: string, loader: (params: string) => void) {
        this._routes.push({ path, title, loader });
    }

    findRoute = (url: string) => this._routes.find((route) => (url === route.path));

    setURLParams(paramsStr: string) {
        let path = window.location.href.split('?')[0];
        window.history.pushState({}, '', path + ((paramsStr.length > 0) ? '?' + paramsStr : ''));
    }
}

export default Router;
