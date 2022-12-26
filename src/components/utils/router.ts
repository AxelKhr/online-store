import { Route } from "../interface/route";
import { AbstractView } from "../view/abstractView";
import { ErrorView } from "../view/error/error";

class Router {

    private _routes: Array<Route>;

    constructor() {
        this._routes = [];
    }

    locationHandler = async () => {
        let path: string = window.location.hash.replace("#", "");
        if (path.length == 0) {
            path = "/";
        }
        const route = this.findRoute(path);
        const view = (route != null) ? await route?.component.getView() : await new ErrorView().getView();
        const content = document.getElementById("content") as HTMLElement;
        content!.innerHTML = '';
        content.appendChild(view);
        document.title = route?.title ?? '404 Not found';
        return route?.component;
    };

    addRoute(path: RegExp, title: string, component: AbstractView) {
        this._routes.push({ path, title, component });
    }

    findRoute = (url: string) => this._routes.find((route) => url.match(route.path));

}

export default Router;
