import { Route } from "../interface/route";
import { AbstractView } from "../view/abstractView";
import { CartView } from "../view/cartView/cartView";
import { ErrorView } from "../view/error/error";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";

class Router {

    private readonly routes: Array<Route>;
    private homeComponent: AbstractView;
    private productComponent: AbstractView;
    private cartComponent: AbstractView;
    curView;

    constructor() {
        this.homeComponent = new MainView();
        this.productComponent = new ProductView();
        this.cartComponent = new CartView();
        this.curView = this.locationHandler;

        this.routes = [
            { path: /product\/\d+/g, title: 'Product', component: this.productComponent },
            { path: /cart/g, title: 'Cart', component: this.cartComponent },
            { path: /\//g, title: 'Online store', component: this.homeComponent }
        ]
    }

    locationHandler = async () => {
        let path: string = window.location.hash.replace("#", "");
        if (path.length == 0) {
            path = "/";
        }
        const route = this.findRoute(path);
        console.log(route);
        const view = (route != null) ? await route?.component.getView() : await new ErrorView().getView();
        const content = document.getElementById("content") as HTMLElement;
        content!.innerHTML = '';
        content.appendChild(view);
        document.title = route?.title ?? '404 Not found';
        return route?.component;
    };

    findRoute = (url: string) => this.routes.find((route) => url.match(route.path));

}

export default Router;
