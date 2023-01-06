import { Product } from "../interface/product";
import { Params } from "../utils/params";
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
    modelMain: ModelMain;
    modelProduct: ModelProduct;
    modelCart: ModelCart;

    constructor() {
        this.modelMain = new ModelMain();
        this.modelProduct = new ModelProduct();
        this.modelCart = new ModelCart();
    }

    get state(): ModelSate {
        return {
            main: this.modelMain.state,
            product: this.modelProduct.state,
            cart: this.modelCart.state
        }
    }

    setProductsData(products: Product[]) {
        this.modelMain.setProducts(products);
        this.modelProduct.setProducts(products);
    }

    setMainParam() {
        this.modelMain.updateModel();
    }

    setProductParam() {
        this.modelProduct.updateModel();
    }

    setCartParam() {
        this.modelCart.updateModel();
    }
}