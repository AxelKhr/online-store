import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";

export class AppController extends AppLoader {
    getProduct(callback: Callback<ProductResponse>): void {
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products,
            },
            callback
        );
        return;
    }

    getCategories(callback: Callback<ProductResponse>): void {
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products,
            },
            callback
        );
        return;
    }
}