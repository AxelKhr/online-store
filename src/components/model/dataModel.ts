import { Product } from "../interface/product";
import Params from "../utils/params";
import { ModelMain, ModelMainState } from "./modelMain";
import { ModelProduct, ModelProductState } from "./modelProduct";

export type ModelStates = ModelMain | ModelProduct;

interface ModelSate {
    main: ModelMainState;
    product: ModelProductState;
}

export class DataModel {
    private _modelMain: ModelMain;
    private _modelProduct: ModelProduct;

    constructor() {
        this._modelMain = new ModelMain();
        this._modelProduct = new ModelProduct();
    }

    get state(): ModelSate {
        return {
            main: this._modelMain.state,
            product: this._modelProduct.state
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
}