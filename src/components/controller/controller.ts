import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";
import { Router } from "../router/router";
import { DataModel, ProductsParams, ProductParams } from "../model/dataModel";
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
        this._mainView.requestUpdateParams = this.requestUpdateProductsParams;
        this._productView = new ProductView(this._cart);
        this._cartView = new CartView();

        this._router.addRoute('product', this.loadProductView);
        this._router.addRoute('cart', this.loadCartView);
        this._router.addRoute('', this.loadMainView);

        document.addEventListener('changemodel', (event) => {
            this._mainView.draw(this._dataModel.state);
        });

        document.addEventListener('changemodelproduct', (event) => {
            this._productView.draw(this._dataModel.state);
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

    async setProducts(products: Product[]) {
        this._dataModel.setProductsData(products);
    }

    // methods to load views 

    private loadMainView = async (params: string) => {
        await this._mainView.setView('Online store');
        const urlparam = (new URLSearchParams(params)).getAll('brand');
        this._dataModel.setProductsParam({
            filters: {
                brand: urlparam
            }
        });
    }

    private loadProductView = async (params: string) => {
        await this._productView.setView('Product');
        const id = (new URLSearchParams(params)).get('id');
        this._dataModel.setProductParam({ id: (id) ? parseInt(id) : 0 });
    }

    private loadCartView = async (params: string) => {
        await this._cartView.setView('Cart');
        this._cartView.draw();
    }

    // methods to update model parameters

    private requestUpdateProductsParams = (params: ProductsParams) => {
        this._dataModel.setProductsParam(params);
        const par = new URLSearchParams();
        params.filters.brand.forEach((item) => {
            par.append('brand', item);
        })
        this._router.setURLParams(par.toString());
    }
}