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
    private router: Router;
    private dataModel: DataModel;
    private _cart: Cart;
    private errorView: ErrorView;
    private homeView: MainView;
    private productView: ProductView;
    private cartView: CartView;

    constructor() {
        super();
        this.router = new Router();
        this.dataModel = new DataModel();
        this._cart = new Cart();
        this.errorView = new ErrorView();
        this.homeView = new MainView(this._cart);
        this.homeView.requestUpdateParams = this.requestUpdateProductsParams;
        this.productView = new ProductView(this._cart);
        this.cartView = new CartView();

        this.router.addRoute('product', this.loadProductView);
        this.router.addRoute('cart', this.loadCartView);
        this.router.addRoute('', this.loadHomeView);

        document.addEventListener('changemodel', (event) => {
            this.homeView.draw(this.dataModel.state);
        });

        document.addEventListener('changemodelproduct', (event) => {
            this.productView.draw(this.dataModel.state);
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
        this.router.locationHandler()
            .catch(() => {
                this.errorView.setView('404 Not found');
            });
    }

    async setProducts(products: Product[]) {
        this.dataModel.setProductsData(products);
    }

    // ways to load views 

    private loadHomeView = async (params: string) => {
        await this.homeView.setView('Online store');
        const urlparam = (new URLSearchParams(params)).getAll('brand');
        this.dataModel.setProductsParam({
            filters: {
                brand: urlparam
            }
        });
    }

    private loadProductView = async (params: string) => {
        await this.productView.setView('Product');
        const id = (new URLSearchParams(params)).get('id');
        this.dataModel.setProductParam({ id: (id) ? parseInt(id) : 0 });
    }

    private loadCartView = async (params: string) => {
        await this.cartView.setView('Cart');
        this.cartView.draw();
    }

    // ways to update model parameters

    private requestUpdateProductsParams = (params: ProductsParams) => {
        this.dataModel.setProductsParam(params);
        const par = new URLSearchParams();
        params.filters.brand.forEach((item) => {
            par.append('brand', item);
        })
        this.router.setURLParams(par.toString());
    }
}