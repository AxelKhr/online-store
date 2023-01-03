export interface SortingData {
    list: Map<string, string>;
    current: string;
}

export class Sorting {
    private _list: Map<string, string>;
    private _current: string;

    constructor() {
        this._list = new Map();
        this._list.set('price-up', 'Price up');
        this._list.set('price-down', 'Price down');
        this._current = 'price-up';
    }

    getData(): SortingData {
        return { list: this._list, current: this._current };
    }
}