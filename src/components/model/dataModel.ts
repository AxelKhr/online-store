import { Product } from "../interface/product";
import Params from "../utils/params";
import { ModelMain, ModelMainState } from "./modelMain";
import { ModelProduct, ModelProductState } from "./modelProduct";
import { ModelCart, ModelCartState } from "./modelCart";

export type ModelStates = ModelMain | ModelProduct;

interface ModelSate {
    main: ModelMainState;
    product: ModelProductState;
    cart: ModelCartState;
}

export class DataModel {
    private _modelMain: ModelMain;
    private _modelProduct: ModelProduct;
    private _modelCart: ModelCart;

    constructor() {
        this._modelMain = new ModelMain();
        this._modelProduct = new ModelProduct();
        this._modelCart = new ModelCart();
    }

    get state(): ModelSate {
        return {
            main: this._modelMain.state,
            product: this._modelProduct.state,
            cart: this._modelCart.state
        }
    }

    setProductsData(products: Product[]) {
        this._modelMain.setProducts(products);
        this._modelProduct.setProducts(products);
    }

    setMainParam(params: Params) {
        this._modelMain.setParams(params);
    }

    setProductParam(params: Params) {
        this._modelProduct.setParams(params);
    }

    setCartParam(params: Params) {
        this._modelCart.setParams(params);
    }
}