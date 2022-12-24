import { Route } from "../interface/route";
import { AbstractView } from "../view/abstractView";
import { Cart } from "../view/cartView/cart/cart";
import { CartView } from "../view/cartView/cartView";
import { ErrorView } from "../view/error/error";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";

class Router {

    private readonly routes: Array<Route>;
    private cart: Cart = new Cart();
    private homeComponent: AbstractView;
    private productComponent: AbstractView;
    private cartComponent: AbstractView;

    constructor() {
        this.homeComponent = new MainView(this.cart);
        this.productComponent = new ProductView(this.cart);
        this.cartComponent = new CartView();

        this.routes = [
            { path: /product\/\d+/g, title: 'Product', component: this.productComponent },
            { path: /cart/g, title: 'Cart', component: this.cartComponent },
            { path: /\//g, title: 'Online store', component: this.homeComponent }
        ]
    }

    locationHandler = async () => {
        let path: string = window.location.hash.replace("#", "");
        if (path.length == 0) {
            path = '/';
        }
        const route = this.findRoute(path);
        const view = (route != null) ? await route?.component.getView() : await new ErrorView().getView();
        const pathArr = path.split('/');
        route?.component.setAttribute(pathArr[pathArr.length - 1]);
        const content = document.getElementById("content") as HTMLElement;
        content!.innerHTML = '';
        content.appendChild(view);
        document.title = route?.title ?? '404 Not found';
        return route?.component;
    };

    findRoute = (url: string) => this.routes.find((route) => url.match(route.path));

}

export default Router;
