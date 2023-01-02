import { Product } from "../interface/product";
import Params from "../utils/params";

export class ListItemParam {
    name: string;
    count: number;
    total: number;
    checked: boolean;

    constructor(name: string, count: number, total: number, checked: boolean) {
        this.name = name;
        this.count = count;
        this.total = total;
        this.checked = checked;
    }
}

export class ListParams extends Map<string, ListItemParam> {
    getCheckedNames() {
        const names: string[] = [];
        this.forEach((item) => {
            if (item.checked) { names.push(item.name) }
        });
        return names;
    }
}

type SearchParams = {
    enable: boolean;
    type: string;
    value: string;
}

type SliderParams = {
    step: number;
    minEn: boolean;
    maxEn: boolean;
    rangeMin: number;
    rangeMax: number;
    currMin: number;
    currMax: number;
    srcMin: number;
    srcMax: number;
}

class MainParams {
    category: ListParams;
    brand: ListParams;
    price: SliderParams;
    stock: SliderParams;
    search: SearchParams;

    constructor() {
        this.category = new ListParams();
        this.brand = new ListParams();
        this.price = {
            step: 1,
            minEn: false,
            maxEn: false,
            rangeMin: 0,
            rangeMax: 1,
            currMin: 0,
            currMax: 1,
            srcMin: 0,
            srcMax: 1
        }
        this.stock = {
            step: 1,
            minEn: false,
            maxEn: false,
            rangeMin: 0,
            rangeMax: 1,
            currMin: 0,
            currMax: 1,
            srcMin: 0,
            srcMax: 1
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
    params: MainParams;

    constructor() {
        this.products = [];
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
        this.state.main.params.category.clear();
        this._categories.forEach((item) => {
            const cnt = this._products.reduce((prev, curr) => (curr.category === item) ? prev += 1 : prev, 0);
            this.state.main.params.category.set(item, new ListItemParam(item, 0, cnt, false));
        });
        const brands = new Set<string>;
        this._products.forEach((item) => {
            brands.add(item.brand);
        });
        this._brands = [...brands];
        this.state.main.params.brand.clear();
        this._brands.forEach((item) => {
            const cnt = this._products.reduce((prev, curr) => (curr.brand === item) ? prev += 1 : prev, 0);
            this.state.main.params.brand.set(item, new ListItemParam(item, 0, cnt, false));
        });
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
            this.state.main.params.price.srcMin = priceMin;
            this.state.main.params.price.srcMax = priceMax;
            this.state.main.params.stock.srcMin = stockMin;
            this.state.main.params.stock.srcMax = stockMax;
        }
    }

    setMainParam(params: Params) {
        this.state.main.products = [];
        const categoryParams = params.getAll('category');
        this.state.main.params.category.forEach((item) => {
            item.checked = categoryParams.includes(item.name);
        });
        const brandParams = params.getAll('brand');
        this.state.main.params.brand.forEach((item) => {
            item.checked = brandParams.includes(item.name);
        });
        const priceMinParam = params.get('price-min');
        this.state.main.params.price.minEn = (priceMinParam.length > 0);
        this.state.main.params.price.currMin = (priceMinParam.length > 0) ? Number(priceMinParam) : this.state.main.params.price.srcMin;
        const priceMaxParam = params.get('price-max');
        this.state.main.params.price.maxEn = (priceMaxParam.length > 0);
        this.state.main.params.price.currMax = (priceMaxParam.length > 0) ? Number(priceMaxParam) : this.state.main.params.price.srcMax;
        const stockMinParam = params.get('stock-min');
        this.state.main.params.stock.minEn = (stockMinParam.length > 0);
        this.state.main.params.stock.currMin = (stockMinParam.length > 0) ? Number(stockMinParam) : this.state.main.params.stock.srcMin;
        const stockMaxParam = params.get('stock-max');
        this.state.main.params.stock.maxEn = (stockMaxParam.length > 0);
        this.state.main.params.stock.currMax = (stockMaxParam.length > 0) ? Number(stockMaxParam) : this.state.main.params.stock.srcMax;
        const searchValue = params.get('search');
        this.state.main.params.search.value = (searchValue.length > 0) ? searchValue : '';
        this.state.main.params.search.enable = (searchValue.length > 0);
        const searchType = params.get('search-type');
        this.state.main.params.search.type = (searchType.length > 0) ? searchType : '';

        if (this._products.length > 0) {
            const productsTemp: Product[] = [];
            const categoriesChecked = this.state.main.params.category.getCheckedNames();
            const brandsChecked = this.state.main.params.brand.getCheckedNames();
            this._products.forEach((item) => {
                let compareValue: string = '';
                if (this.state.main.params.search.enable) {
                    compareValue = (item[this.state.main.params.search.type as keyof Product] as string).toLowerCase();
                }
                if (
                    (categoriesChecked.length === 0 || categoriesChecked.includes(item.category)) &&
                    (brandsChecked.length === 0 || brandsChecked.includes(item.brand)) &&
                    (!(this.state.main.params.search.enable) ||
                        (compareValue.includes(this.state.main.params.search.value.toLowerCase())))
                ) {
                    productsTemp.push(item);
                }
            });
            if (productsTemp.length > 0) {
                // set range for price slider
                const rangePriceMin = Math.min(...productsTemp.map((item) => item.price))
                if (this.state.main.params.price.minEn) {
                    this.state.main.params.price.rangeMin =
                        Math.min(rangePriceMin, this.state.main.params.price.currMin);
                } else {
                    this.state.main.params.price.rangeMin = rangePriceMin;
                    this.state.main.params.price.currMin = rangePriceMin;
                }

                const rangePriceMax = Math.max(...productsTemp.map((item) => item.price));
                if (this.state.main.params.price.maxEn) {
                    this.state.main.params.price.rangeMax =
                        Math.max(rangePriceMax, this.state.main.params.price.currMax);
                } else {
                    this.state.main.params.price.rangeMax = rangePriceMax;
                    this.state.main.params.price.currMax = rangePriceMax;
                }
                // set range for stock slider
                const rangeStockMin = Math.min(...productsTemp.map((item) => item.stock));
                if (this.state.main.params.stock.minEn) {
                    this.state.main.params.stock.rangeMin =
                        Math.min(rangeStockMin, this.state.main.params.stock.currMin);
                } else {
                    this.state.main.params.stock.rangeMin = rangeStockMin;
                    this.state.main.params.stock.currMin = rangeStockMin;
                }

                const rangeStockMax = Math.max(...productsTemp.map((item) => item.stock));
                if (this.state.main.params.stock.maxEn) {
                    this.state.main.params.stock.rangeMax =
                        Math.max(rangeStockMax, this.state.main.params.stock.currMax);
                } else {
                    this.state.main.params.stock.rangeMax = rangeStockMax;
                    this.state.main.params.stock.currMax = rangeStockMax;
                }
                // filter products by sliders
                productsTemp.forEach((item) => {
                    if (
                        (item.price >= this.state.main.params.price.currMin) &&
                        (item.price <= this.state.main.params.price.currMax) &&
                        (item.stock >= this.state.main.params.stock.currMin) &&
                        (item.stock <= this.state.main.params.stock.currMax)
                    ) {
                        this.state.main.products.push(item);
                    }
                });
            }
            // counts for filter lists
            this.state.main.params.category.forEach((item) => {
                item.count = this.state.main.products.reduce((prev, curr) =>
                    (curr.category === item.name) ? prev += 1 : prev, 0);
            });
            this.state.main.params.brand.forEach((item) => {
                item.count = this.state.main.products.reduce((prev, curr) =>
                    (curr.brand === item.name) ? prev += 1 : prev, 0);
            });
        }
        document.dispatchEvent(this._updateEvent);
    }

    setProductParam(params: Params) {
        this.state.prod.product = this._products.find((item) => item.id === parseInt(params.get('id')));
        document.dispatchEvent(this._updateProductEvent);
    }
}