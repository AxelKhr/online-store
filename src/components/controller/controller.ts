import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";
import { Router } from "../router/router";
import { DataModel } from "../model/dataModel";
import { Cart } from "../view/cartView/cart/cart";
import { ErrorView } from "../view/error/error";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";
import { CartView } from "../view/cartView/cartView";

export class AppController extends AppLoader {
    private _router: Router;
    private _dataModel: DataModel;
    private _cart: Cart;
    private _errorView: ErrorView;
    private _mainView: MainView;
    private _productView: ProductView;
    private _cartView: CartView;

    constructor() {
        super();
        this._router = new Router();
        this._dataModel = new DataModel();
        this._cart = new Cart();
        this._errorView = new ErrorView();
        this._mainView = new MainView(this._cart);
        this._mainView.requestUpdateParams = this.requestUpdateMainParams;
        this._productView = new ProductView(this._cart);
        this._productView.requestQuickBuy = this.routeToQuickBuy;
        this._cartView = new CartView(this._cart);
        this._cartView.requestUpdateParams = this.requestUpdateCartParams;

        this._router.addRoute('product', this.loadProductView);
        this._router.addRoute('cart', this.loadCartView);
        this._router.addRoute('', this.loadMainView);

        document.addEventListener('changemodelmain', (event) => {
            this._mainView.update(this._dataModel.state.main);
        });

        document.addEventListener('changemodelmaintable', (event) => {
            this._mainView.updateTable(this._dataModel.state.main);
        });

        document.addEventListener('changemodelproduct', (event) => {
            this._productView.draw(this._dataModel.state.product);
        });

        document.addEventListener('changemodelcart', (event) => {
            this._cartView.update(this._dataModel.state.cart);
        });
    }

    loadData(callback: Callback<ProductResponse>) {
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products,
            },
            callback
        );
        return;
    }

    handleLocation = () => {
        this._router.locationHandler()
            .catch(() => {
                this._errorView.setView('404 Not found');
            });
    }

    async init(products: Product[]) {
        this._cart.initCartProduct(products);
        this._dataModel.setProductsData(products);
    }

    // methods to load views 

    private loadMainView = async (params: string) => {
        await this._mainView.setView('Online store');
        this._dataModel.setMainParam();
    }

    private loadProductView = async (params: string) => {
        const id = (new URLSearchParams(params)).get('id');
        if (id) {
            await this._productView.setView('Product');
            this._dataModel.setProductParam();
        } else {
            this._errorView.setView('404 Not found');
        }
    }

    private loadCartView = async (params: string) => {
        await this._cartView.setView('Cart');
        this._cartView.draw();
        this._dataModel.setCartParam();
    }

    // methods to update model parameters

    private requestUpdateMainParams = () => {
        this._dataModel.setMainParam();
    }

    private requestUpdateCartParams = () => {
        this._dataModel.setCartParam();
    }

    // other methods

    private routeToQuickBuy = async (item: Product) => {
        this._cart.addToCart(item);
        this._dataModel.modelCart.setModalWindowState(true);
        window.location.href = window.location.origin + '#/cart';
    }
}