import { Route } from "../interface/route";
import { CartView } from "../view/cartView";
import { ErrorView } from "../view/error";
import { MainView } from "../view/mainView";
import { ProductView } from "../view/productView";

class Router {

    private readonly routes: Array<Route>;
    private homeComponent: MainView;
    private productComponent: ProductView;
    private cartComponent: CartView;

    constructor() {
        this.homeComponent = new MainView();
        this.productComponent = new ProductView();
        this.cartComponent = new CartView();
        
        this.routes = [
            { path: '/', title: 'Online store', component: this.homeComponent},
            { path: 'product', title: 'Product', component: this.productComponent},
            { path: 'cart', title: 'Cart', component: this.cartComponent}
        ]
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
    };

    findRoute = (url: string) => this.routes.find((route) => route.path == url);

}

export default Router;