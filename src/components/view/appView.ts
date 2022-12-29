import { AppController } from "../controller/controller";
import { CartView } from "../view/cartView/cartView";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";
import { Cart } from "../view/cartView/cart/cart";
import { DataModel } from "../model/dataModel";

export default class AppView {
    homeView: MainView;
    productView: ProductView;
    cartView: CartView;
    private _cart: Cart;

    constructor(controller: AppController, model: DataModel) {
        this._cart = new Cart();
        this.homeView = new MainView(this._cart);
        this.homeView.requestUpdateParams = controller.requestUpdateProductsParams;
        this.productView = new ProductView(this._cart);
        this.cartView = new CartView();

        document.addEventListener('changemodel', (event) => {
            this.homeView.draw(model.state);
        });

        document.addEventListener('changemodelproduct', (event) => {
            this.productView.draw(model.state);
        });
    }
}
