import { AppController } from "../controller/controller";
import { AbstractView } from "../view/abstractView";
import { CartView } from "../view/cartView/cartView";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";
import { Cart } from "../view/cartView/cart/cart";

export default class AppView {
    homeView: MainView;
    productView: ProductView;
    cartView: CartView;
    private _cart: Cart;

    constructor(controller: AppController) {
        this._cart = new Cart();
        this.homeView = new MainView(this._cart);
        this.productView = new ProductView(this._cart);
        this.cartView = new CartView();
    }
}
