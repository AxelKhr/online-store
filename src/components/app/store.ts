import { AppController } from "../controller/controller";
import Router from "../utils/router";
import DataModel from "../model/dataModel";
import { Cart } from "../view/cartView/cart/cart";
import { AbstractView } from "../view/abstractView";
import { CartView } from "../view/cartView/cartView";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";

class Store {

    private router: Router;
    private controller: AppController;
    private dataModel: DataModel;
    private cart: Cart;
    private homeView: MainView;
    private productView: ProductView;
    private cartView: CartView;

    constructor() {
        this.router = new Router();
        this.controller = new AppController();
        this.dataModel = new DataModel();
        this.cart = new Cart();
        this.homeView = new MainView(this.cart);
        this.productView = new ProductView(this.cart);
        this.cartView = new CartView();

        this.router.addRoute(/product\/\d+/g, 'Product', this.productView);
        this.router.addRoute(/cart/g, 'Cart', this.cartView)
        this.router.addRoute(/\//g, 'Online store', this.homeView);
    }

    init() {
        this.route();
        window.addEventListener("hashchange", this.route);
    }

    route = () => {
        this.router.locationHandler().then((view) => {
            this.controller.getProducts((data) => {
                if (data.products !== undefined) {
                    view?.draw(data.products);
                } else {
                    view?.draw(data);
                }
            })
        })
    }

}

export default Store;