import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";
import Router from "../utils/router";
import AppView from "../view/appView";
import { DataModel, ProductsParams } from "../model/dataModel";
import { ErrorView } from "../view/error/error";

export class AppController extends AppLoader {
    private router: Router;
    private errorView: ErrorView;
    private appView: AppView;
    private dataModel: DataModel;

    constructor() {
        super();
        this.router = new Router();
        this.errorView = new ErrorView();
        this.dataModel = new DataModel();
        this.appView = new AppView(this, this.dataModel);

        //this.router.addRoute(/product\/\d+/g, 'Product', this.appView.productView);
        this.router.addRoute('/cart/', 'Cart', this.loadCartView);
        this.router.addRoute('/', 'Online store', this.loadHomeView);
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

    async setProducts(products: Product[]) {
        this.dataModel.setProductsData(products);
    }

    handleLocation = () => {
        this.router.locationHandler()
            .catch((error) => {
                this.errorView.setView('404 Not found');
            });
    }

    loadHomeView = async (params: string) => {
        await this.appView.homeView.setView('Online store');
        const urlparam = (new URLSearchParams(params)).getAll('brand');
        this.dataModel.setProductsParam({
            filters: {
                brand: urlparam
            }
        });
    }

    loadCartView = async (params: string) => {
        await this.appView.cartView.setView('Cart');
        this.appView.cartView.draw();
    }

    requestUpdateProductsParams = (params: ProductsParams) => {
        this.dataModel.setProductsParam(params);
        const par = new URLSearchParams();
        params.filters.brand.forEach((item) => {
            par.append('brand', item);
        })
        this.router.setURLParams(par.toString());
    }
}