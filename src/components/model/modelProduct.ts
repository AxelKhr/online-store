import { Product } from "../interface/product";
import { Params, getParamsFromURL } from "../utils/params";

export interface ModelProductState {
    product: Product | undefined;
}

export class ModelProduct {
    private _products: Product[];
    private _updateProductEvent: Event;
    private _product: Product | undefined;

    constructor() {
        this._products = [];
        this._product = undefined;
        this._updateProductEvent = new Event('changemodelproduct');
    }

    setProducts(products: Product[]) {
        this._products = products;
    }

    updateModel() {
        const params = getParamsFromURL(window.location.href);
        this._product = this._products.find((item) => item.id === parseInt(params.get('id')));
        document.dispatchEvent(this._updateProductEvent);
    }

    get state(): ModelProductState {
        return { product: this._product };
    }

}



