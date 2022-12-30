import { Product } from "../interface/product";
import Params from "../utils/params";

class MainParams {
    brand: string[];
    category: string[];

    constructor() {
        this.brand = [];
        this.category = [];
    }
}

class ModelMainState {
    products: Product[];
    brands: string[];
    categories: string[];
    params: MainParams;

    constructor() {
        this.products = [];
        this.brands = [];
        this.categories = [];
        this.params = new MainParams();
    }
}

class ModelProductState {
    product: Product | undefined;
}

export class ModelState {
    main: ModelMainState;
    prod: ModelProductState;

    constructor() {
        this.main = new ModelMainState();
        this.prod = new ModelProductState();
    }
}

export class DataModel {
    private _products: Product[];
    private _brands: string[];
    private _categories: string[];
    private _updateEvent: Event;
    private _updateProductEvent: Event;
    state: ModelState;

    constructor() {
        this._products = [];
        this._brands = [];
        this._categories = [];
        this._updateEvent = new Event('changemodel');
        this._updateProductEvent = new Event('changemodelproduct');
        this.state = new ModelState();
    }

    getProductsData() {
        return this._products;
    }

    setProductsData(products: Product[]) {
        this._products = [];
        products.forEach((item) => {
            this._products.push(item);
        });
        const categories = new Set<string>;
        this._products.forEach((item) => {
            categories.add(item.category);
        });
        this._categories = [...categories];
        const brands = new Set<string>;
        this._products.forEach((item) => {
            brands.add(item.brand);
        });
        this._brands = [...brands];
    }

    setMainParam(params: Params) {
        this.state.main.products = [];
        this.state.main.categories = this._categories;
        this.state.main.brands = this._brands;
        this.state.main.params.brand = params.getAll('brand');
        this.state.main.params.category = params.getAll('category');

        const checkList = (list: string[], item: string) => ((list.length === 0) || (list.includes(item)));
        this._products.forEach((item) => {
            if (checkList(this.state.main.params.category, item.category) &&
                checkList(this.state.main.params.brand, item.brand)) {
                this.state.main.products.push(item);
            }
        });
        document.dispatchEvent(this._updateEvent);
    }

    setProductParam(params: Params) {
        this.state.prod.product = this._products.find((item) => item.id === parseInt(params.get('id')));
        document.dispatchEvent(this._updateProductEvent);
    }
}