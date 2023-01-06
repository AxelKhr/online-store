import { Product } from "../interface/product";
import { Params, getParamsFromURL, setParamsToURL } from "../utils/params";
import { filterList, ListParams, ListItemParam } from "./filterList";
import { filterSearch, SearchParams } from "./filterSearch";
import { setRange, filterRange, RangeParams } from "./filterRange";
import { sortData, SortingParams } from "./sorting";

class MainParams {
    category: ListParams;
    brand: ListParams;
    price: RangeParams;
    stock: RangeParams;
    search: SearchParams;
    sorting: SortingParams;
    view: string;

    constructor() {
        this.category = new ListParams('category');
        this.brand = new ListParams('brand');
        this.price = new RangeParams('price');
        this.stock = new RangeParams('stock');
        this.search = new SearchParams();
        this.sorting = new SortingParams();
        this.view = 'grid';
    }
}

export interface ModelMainState {
    productsList: Product[];
    params: MainParams;
}

export class ModelMain {
    private _products: Product[];
    private _updateEvent: Event;
    private _productsList: Product[];
    private _params: MainParams;

    constructor() {
        this._products = [];
        this._updateEvent = new Event('changemodelmain');
        this._productsList = [];
        this._params = new MainParams();
    }

    setProducts(products: Product[]) {
        this._products = [];
        products.forEach((item) => {
            this._products.push(item);
        });
        const categories = new Set<string>;
        this._products.forEach((item) => {
            categories.add(item.category);
        });
        this._params.category.clear();
        categories.forEach((item) => {
            const cnt = this._products.reduce((prev, curr) => (curr.category === item) ? prev += 1 : prev, 0);
            this._params.category.set(item, new ListItemParam(item, 0, cnt, false));
        });
        const brands = new Set<string>;
        this._products.forEach((item) => {
            brands.add(item.brand);
        });
        this._params.brand.clear();
        brands.forEach((item) => {
            const cnt = this._products.reduce((prev, curr) => (curr.brand === item) ? prev += 1 : prev, 0);
            this._params.brand.set(item, new ListItemParam(item, 0, cnt, false));
        });
        if (this._products.length > 0) {
            this._params.price.srcMin = Math.min(...this._products.map((item) => item.price))
            this._params.price.srcMax = Math.max(...this._products.map((item) => item.price))
            this._params.stock.srcMin = Math.min(...this._products.map((item) => item.stock))
            this._params.stock.srcMax = Math.max(...this._products.map((item) => item.stock))
        }
    }

    async updateModel() {
        this._productsList = [];
        this._params = updateMainParamsFromUrl(this._params);

        // filters and sorting
        await filterList(this._products, this._params.category)
            .then((products) => filterList(products, this._params.brand))
            .then((products) => filterSearch(products, this._params.search))
            .then((products) => setRange(products, this._params.price))
            .then((products) => setRange(products, this._params.stock))
            .then((products) => filterRange(products, this._params.price))
            .then((products) => filterRange(products, this._params.stock))
            .then((products) => sortData(products, this._params.sorting))
            .then((products) => this._productsList = products);

        // counts for filter lists
        this._params.category.forEach((item) => {
            item.count = this._productsList.reduce((prev, curr) =>
                (curr.category === item.name) ? prev += 1 : prev, 0);
        });
        this._params.brand.forEach((item) => {
            item.count = this._productsList.reduce((prev, curr) =>
                (curr.brand === item.name) ? prev += 1 : prev, 0);
        });

        updateUrlFromMainParams(this._params)
        document.dispatchEvent(this._updateEvent);
    }

    get state(): ModelMainState {
        return {
            productsList: this._productsList,
            params: this._params
        }
    }
}

function updateMainParamsFromUrl(mainParams: MainParams): MainParams {
    const params = getParamsFromURL(window.location.href);

    const categoryParams = params.getAll('category');
    mainParams.category.forEach((item) => {
        item.checked = categoryParams.includes(item.name);
    });
    const brandParams = params.getAll('brand');
    mainParams.brand.forEach((item) => {
        item.checked = brandParams.includes(item.name);
    });
    const priceMinParam = params.get('price-min');
    mainParams.price.minEn = (priceMinParam.length > 0);
    mainParams.price.currMin = (priceMinParam.length > 0) ? Number(priceMinParam) : mainParams.price.srcMin;
    const priceMaxParam = params.get('price-max');
    mainParams.price.maxEn = (priceMaxParam.length > 0);
    mainParams.price.currMax = (priceMaxParam.length > 0) ? Number(priceMaxParam) : mainParams.price.srcMax;
    const stockMinParam = params.get('stock-min');
    mainParams.stock.minEn = (stockMinParam.length > 0);
    mainParams.stock.currMin = (stockMinParam.length > 0) ? Number(stockMinParam) : mainParams.stock.srcMin;
    const stockMaxParam = params.get('stock-max');
    mainParams.stock.maxEn = (stockMaxParam.length > 0);
    mainParams.stock.currMax = (stockMaxParam.length > 0) ? Number(stockMaxParam) : mainParams.stock.srcMax;
    const searchValue = params.get('search');
    mainParams.search.value = (searchValue.length > 0) ? searchValue : '';
    mainParams.search.enable = (searchValue.length > 0);
    const searchType = params.get('search-type');
    mainParams.search.type = (searchType.length > 0) ? searchType : '';
    const sorting = params.get('sort');
    mainParams.sorting.current = (sorting.length > 0) ? sorting : '';
    const viewControl = params.get('view');
    mainParams.view = (viewControl.length > 0) ? viewControl : 'grid';

    return mainParams;
}

function updateUrlFromMainParams(mainParams: MainParams): void {
    const params = new Params();

    params.setUpdateURLState(false);
    mainParams.category.forEach((item) => {
        item.checked && params.add('category', item.name);
    })
    mainParams.brand.forEach((item) => {
        item.checked && params.add('brand', item.name);
    })
    mainParams.price.minEn && params.replace('price-min', mainParams.price.currMin.toString());
    mainParams.price.maxEn && params.replace('price-max', mainParams.price.currMax.toString());
    mainParams.stock.minEn && params.replace('stock-min', mainParams.stock.currMin.toString());
    mainParams.stock.maxEn && params.replace('stock-max', mainParams.stock.currMax.toString());
    if (mainParams.search.enable) {
        params.add('search-type', mainParams.search.type);
        params.add('search', mainParams.search.value);
    }
    if (mainParams.sorting.enable) {
        params.replace('sort', mainParams.sorting.current);
    } else {
        params.remove('sort');
    }
    if ((mainParams.view.length > 0) && (mainParams.view !== 'grid')) {
        params.replace('view', mainParams.view);
    } else {
        params.remove('view');
    }
    params.setUpdateURLState(true);
    setParamsToURL(params, true);
}