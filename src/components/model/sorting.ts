import { Product } from "../interface/product";

export class SortingParams {
    private _list: Map<string, string>;
    private _current: string;
    private _enable: boolean;

    constructor() {
        this._list = new Map();
        this._list.set('price-asc', 'Price: low to high');
        this._list.set('price-desc', 'Price: hight to low');
        this._list.set('rating-asc', 'Rating: low to high');
        this._list.set('rating-desc', 'Rating: hight to low');
        this._list.set('discount-asc', 'Discount: low to high');
        this._list.set('discount-desc', 'Discount: hight to low');
        this._current = 'price-asc';
        this._enable = false;
    }

    get list() {
        return this._list;
    }

    get current() {
        return this._current;
    }

    get enable() {
        return this._enable;
    }

    set current(value) {
        if ((value.length !== 0) || [...this._list.keys()].includes(value)) {
            this._current = value;
            this._enable = (this._current !== 'price-asc');
        } else {
            this._enable = false;
            this._current = 'price-asc';
        }
    }

    add(paramName: string, paramTitle: string) {
        this.list.set(paramName, paramTitle);
    }
}

export async function sortData(data: Product[], params: SortingParams): Promise<Product[]> {
    return new Promise(function (resolve) {
        if ((data.length > 0) && (params.current.length > 0)) {
            switch (params.current) {
                case 'price-asc':
                    data.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    data.sort((a, b) => b.price - a.price);
                    break;
                case 'rating-asc':
                    data.sort((a, b) => a.rating - b.rating);
                    break;
                case 'rating-desc':
                    data.sort((a, b) => b.rating - a.rating);
                    break;
                case 'discount-asc':
                    data.sort((a, b) => a.discountPercentage - b.discountPercentage);
                    break;
                case 'discount-desc':
                    data.sort((a, b) => b.discountPercentage - a.discountPercentage);
                    break;
                default:
                    resolve(data);
                    break;
            }
            resolve(data);
        }
        resolve(data);
    });
}