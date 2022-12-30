import { Product } from "../interface/product";
import Params from "../utils/params";

type Filters = {
    brand: string[];
    category: string[];
}

export interface ModelMainState {
    products: Product[];
    brands: string[];
    categories: string[];
    filters: Filters;
}

export interface ModelProductState {
    product: Product | undefined;
}

export interface ModelState {
    main: ModelMainState;
    prod: ModelProductState;
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

        this.state = {
            main: {
                products: [],
                brands: [],
                categories: [],
                filters: {
                    brand: [],
                    category: []
                }
            },
            prod: {
                product: undefined
            }
        };
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
        this.state.main.filters.brand = params.getAll('brand');
        this.state.main.filters.category = params.getAll('category');

        const checkList = (list: string[], item: string) => ((list.length === 0) || (list.includes(item)));
        this._products.forEach((item) => {
            if (checkList(this.state.main.filters.category, item.category) &&
                checkList(this.state.main.filters.brand, item.brand)) {
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