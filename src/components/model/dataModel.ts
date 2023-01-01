import { Product } from "../interface/product";
import Params from "../utils/params";

type searchParams = {
    enable: boolean;
    type: string;
    value: string;
}

type sliderParams = {
    step: number;
    minEn: boolean;
    maxEn: boolean;
    rangeMin: number;
    rangeMax: number;
    currMin: number;
    currMax: number;
}

class MainParams {
    brand: string[];
    category: string[];
    price: sliderParams;
    stock: sliderParams;
    search: searchParams;

    constructor() {
        this.brand = [];
        this.category = [];
        this.price = {
            step: 1,
            minEn: false,
            maxEn: false,
            rangeMin: 0,
            rangeMax: 1,
            currMin: 0,
            currMax: 1
        }
        this.stock = {
            step: 1,
            minEn: false,
            maxEn: false,
            rangeMin: 0,
            rangeMax: 1,
            currMin: 0,
            currMax: 1
        }
        this.search = {
            enable: false,
            type: '',
            value: ''
        }
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

        if (this._products.length > 0) {
            let priceMin = this._products[0].price;
            let priceMax = this._products[0].price;
            let stockMin = this._products[0].stock;
            let stockMax = this._products[0].stock;
            this._products.forEach((item) => {
                if (item.price < priceMin) {
                    priceMin = item.price;
                }
                if (item.price > priceMax) {
                    priceMax = item.price;
                }
                if (item.stock < stockMin) {
                    stockMin = item.stock;
                }
                if (item.stock > stockMax) {
                    stockMax = item.stock;
                }
            })
            this.state.main.params.price.rangeMin = priceMin;
            this.state.main.params.price.rangeMax = priceMax;
            this.state.main.params.stock.rangeMin = stockMin;
            this.state.main.params.stock.rangeMax = stockMax;
        }
    }

    setMainParam(params: Params) {
        this.state.main.products = [];
        this.state.main.categories = this._categories;
        this.state.main.brands = this._brands;
        this.state.main.params.brand = params.getAll('brand');
        this.state.main.params.category = params.getAll('category');
        const priceMinParam = params.get('price-min');
        this.state.main.params.price.minEn = (priceMinParam.length > 0);
        this.state.main.params.price.currMin = (priceMinParam.length > 0) ? Number(priceMinParam) : this.state.main.params.price.rangeMin;
        const priceMaxParam = params.get('price-max');
        this.state.main.params.price.maxEn = (priceMaxParam.length > 0);
        this.state.main.params.price.currMax = (priceMaxParam.length > 0) ? Number(priceMaxParam) : this.state.main.params.price.rangeMax;
        const stockMinParam = params.get('stock-min');
        this.state.main.params.stock.minEn = (stockMinParam.length > 0);
        this.state.main.params.stock.currMin = (stockMinParam.length > 0) ? Number(stockMinParam) : this.state.main.params.stock.rangeMin;
        const stockMaxParam = params.get('stock-max');
        this.state.main.params.stock.maxEn = (stockMaxParam.length > 0);
        this.state.main.params.stock.currMax = (stockMaxParam.length > 0) ? Number(stockMaxParam) : this.state.main.params.stock.rangeMax;
        const searchValue = params.get('search');
        this.state.main.params.search.value = (searchValue.length > 0) ? searchValue : '';
        this.state.main.params.search.enable = (searchValue.length > 0);
        const searchType = params.get('search-type');
        this.state.main.params.search.type = (searchType.length > 0) ? searchType : '';

        if (this._products.length > 0) {
            const productsTemp: Product[] = [];
            const checkList = (list: string[], item: string) => ((list.length === 0) || (list.includes(item)));
            this._products.forEach((item) => {
                let compareValue: string = '';
                if (this.state.main.params.search.enable) {
                    compareValue = (item[this.state.main.params.search.type as keyof Product] as string).toLowerCase();
                }
                if (
                    checkList(this.state.main.params.category, item.category) &&
                    checkList(this.state.main.params.brand, item.brand) &&
                    (item.stock >= this.state.main.params.stock.currMin) &&
                    (item.stock <= this.state.main.params.stock.currMax) &&
                    (!(this.state.main.params.search.enable) ||
                        (compareValue.includes(this.state.main.params.search.value.toLowerCase())))
                ) {
                    productsTemp.push(item);
                }
            });
            if (productsTemp.length > 0) {
                const rangePriceMin = Math.min(...productsTemp.map((item) => item.price))
                if (this.state.main.params.price.minEn) {
                    this.state.main.params.price.rangeMin =
                        Math.min(rangePriceMin, this.state.main.params.price.currMin);
                } else {
                    this.state.main.params.price.rangeMin = rangePriceMin;
                    this.state.main.params.price.currMin = rangePriceMin;
                }
                const rangePriceMax = Math.max(...productsTemp.map((item) => item.price));
                this.state.main.params.price.rangeMax = rangePriceMax;
                if (this.state.main.params.price.minEn) {
                    this.state.main.params.price.rangeMax =
                        Math.max(rangePriceMax, this.state.main.params.price.currMax);
                } else {
                    this.state.main.params.price.rangeMax = rangePriceMax;
                    this.state.main.params.price.currMax = rangePriceMax;
                }
                productsTemp.forEach((item) => {
                    if (
                        (item.price >= this.state.main.params.price.currMin) &&
                        (item.price <= this.state.main.params.price.currMax)
                    ) {
                        this.state.main.products.push(item);
                    }
                });
            }
        }
        document.dispatchEvent(this._updateEvent);
    }

    setProductParam(params: Params) {
        this.state.prod.product = this._products.find((item) => item.id === parseInt(params.get('id')));
        document.dispatchEvent(this._updateProductEvent);
    }
}