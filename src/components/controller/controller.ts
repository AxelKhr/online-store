import { Endpoint } from "../enum/endpoint";
import { Callback } from "../interface/callback";
import { ProductResponse } from "../interface/product";
import AppLoader from "./appLoader";

export class AppController extends AppLoader {
    getProducts(callback: Callback<ProductResponse>): void {
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products,
            },
            callback
        );
        return;
    }

    drawProduct(e: Event, callback: Callback<ProductResponse>): void {
        let target = <HTMLElement>e.target;
        console.log(target.closest('a')?.getAttribute('href'));
        super.getResp<ProductResponse>(
            {
                endpoint: Endpoint.Products,
                options: {
                    sources: '',
                }
            },
            callback
        );
        return;
    }
}