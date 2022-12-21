import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { Product, ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";

export class AppController extends AppLoader {
    getProducts(callback: Callback<ProductResponse>): void {
        const path = window.location.hash.split('/');
        const id = (path.length > 1) ? path[1] : '';
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products + `/${id}`,
            },
            callback
        );
        return;
    }
}