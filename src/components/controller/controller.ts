import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import { ProductModel } from "../model/productModel";
import Router from "../utils/router";
import AppLoader from "./appLoader";

export class AppController extends AppLoader {
    
    private router: Router;
    private model: ProductModel;

    constructor() {
        super();
        this.router = new Router();
        this.model = new ProductModel();
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

    async initProducts(products: Product[]) {
        this.model.setProducts(products);
    }
    
    drawView() {
        this.router.locationHandler().then((view) => view?.draw(this.model));
    }
}