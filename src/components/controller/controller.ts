import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";
import { Router } from "../router/router";
import { Cart } from "../view/cartView/cart/cart";
import { ErrorView } from "../view/error/error";
import { MainView } from "../view/mainView/mainView";
import { ProductView } from "../view/productView/productView";
import { CartView } from "../view/cartView/cartView";
import { ModelMain } from "../model/modelMain";
import { ModelProduct } from "../model/modelProduct";
import { ModelCart } from "../model/modelCart";

export class AppController extends AppLoader {
    private _router: Router;
    private _cart: Cart;
    private _errorView: ErrorView;
    private _mainView: MainView;
    private _mainModel: ModelMain;
    private _productView: ProductView;
    private _productModel: ModelProduct;
    private _cartView: CartView;
    private _cartModel: ModelCart;

    constructor() {
        super();
        this._router = new Router();
        this._cart = new Cart();
        this._errorView = new ErrorView();
        this._mainView = new MainView(this._cart);
        this._mainView.requestUpdateParams = this.requestUpdateMainParams;
        this._mainModel = new ModelMain();
        this._productView = new ProductView(this._cart);
        this._productView.requestQuickBuy = this.routeToQuickBuy;
        this._productModel = new ModelProduct();
        this._cartView = new CartView(this._cart);
        this._cartView.requestUpdateParams = this.requestUpdateCartParams;
        this._cartModel = new ModelCart();

        this._router.addRoute('product', this.loadProductView);
        this._router.addRoute('cart', this.loadCartView);
        this._router.addRoute('', this.loadMainView);

        document.addEventListener('changemodelmain', () => {
            this._mainView.update(this._mainModel.state);
        });

        document.addEventListener('changemodelmaintable', () => {
            this._mainView.updateTable(this._mainModel.state);
        });

        document.addEventListener('changemodelproduct', () => {
            this._productView.draw(this._productModel.state);
        });

        document.addEventListener('changemodelcart', () => {
            this._cartView.update(this._cartModel.state);
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
        this._mainModel.setProducts(products);
        this._productModel.setProducts(products);
    }

    // methods to load views

    private loadMainView = async () => {
        await this._mainView.setView('Online store');
        this._mainModel.updateModel(true);
    }

    private loadProductView = async (params: string) => {
        const id = (new URLSearchParams(params)).get('id');
        if (id) {
            await this._productView.setView('Product');
            this._productModel.updateModel();
        } else {
            this._errorView.setView('404 Not found');
        }
    }

    private loadCartView = async () => {
        await this._cartView.setView('Cart');
        this._cartView.draw();
        this._cartModel.updateModel();
    }

    // methods to update model parameters

    private requestUpdateMainParams = () => {
        this._mainModel.updateModel();
    }

    private requestUpdateCartParams = () => {
        this._cartModel.updateModel();
    }

    // other methods

    private routeToQuickBuy = async (item: Product) => {
        this._cart.addToCart(item);
        this._cartModel.setModalWindowState(true);
        window.location.href = window.location.origin + '#/cart';
    }
}
