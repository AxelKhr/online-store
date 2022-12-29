import { Product } from "../interface/product";

type Filters = {
    brand: string[];
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

export interface ProductsParams {
    filters: {
        brand: string[];
    }
}

export interface ProductParams {
    id: number;
}

export class DataModel {
    private _products: Product[];
    private _brands: string[];
    private _categories: string[];
    private _updateEvent: Event;
    private _updateProductEvent: Event;
    private _params: ProductsParams;
    state: ModelState;

    constructor() {
        this._products = [];
        this._brands = [];
        this._categories = [];
        this._updateEvent = new Event('changemodel');
        this._updateProductEvent = new Event('changemodelproduct');
        this._params = {
            filters: {
                brand: []
            }
        };

        this.state = {
            main: {
                products: [],
                brands: [],
                categories: [],
                filters: {
                    brand: []
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

    setProductsParam(params: ProductsParams) {
        this.state.main.products = [];
        this.state.main.categories = this._categories;
        this.state.main.brands = this._brands;
        this._products.forEach((item) => {
            this.state.main.filters.brand = params.filters.brand;
            if (params.filters.brand.length) {
                if (params.filters.brand.includes(item.brand)) {
                    this.state.main.products.push(item);
                }
            } else {
                this.state.main.products.push(item);
            }
        });
        document.dispatchEvent(this._updateEvent);
    }

    setProductParam(params: ProductParams) {
        this.state.prod.product = this._products.find((item) => item.id === params.id);
        document.dispatchEvent(this._updateProductEvent);
    }
}