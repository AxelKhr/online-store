import { Product } from "../interface/product";

type Filters = {
    brand: string[];
}

export interface ModelState {
    products: Product[];
    brands: string[];
    categories: string[];
    filters: Filters;
}

export interface ProductsParams {
    filters: {
        brand: string[];
    }
}

export class DataModel {
    private _products: Product[];
    private _brands: string[];
    private _categories: string[];
    private _updateEvent: Event;
    private _params: ProductsParams;
    state: ModelState;

    constructor() {
        this._products = [];
        this._brands = [];
        this._categories = [];
        this._updateEvent = new Event('changemodel');
        this._params = {
            filters: {
                brand: []
            }
        };

        this.state = {
            products: [],
            brands: [],
            categories: [],
            filters: {
                brand: []
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

    setProductsParam(params: ProductsParams) {
        this.state.products = [];
        this.state.categories = this._categories;
        this.state.brands = this._brands;
        this._products.forEach((item) => {
            this.state.filters.brand = params.filters.brand;
            if (params.filters.brand.length) {
                if (params.filters.brand.includes(item.brand)) {
                    this.state.products.push(item);
                }
            } else {
                this.state.products.push(item);
            }
        });
        document.dispatchEvent(this._updateEvent);
    }
}