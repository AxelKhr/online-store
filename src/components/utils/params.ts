export default class Params {
    private _params: Map<string, Set<string>>;

    constructor(params?: [key: string, value: string][]) {
        this._params = new Map();
        if (params) {
            this.addAll(params);
        }
    }

    clear() {
        this._params.clear();
    }

    get(key: string): string {
        const elem = this._params.get(key);
        if (elem) {
            return elem.values().next().value;
        }
        return '';
    }

    getAll(key: string) {
        const elem = this._params.get(key);
        if (elem) {
            return [...elem.values()];
        }
        return [];
    }

    getPairs() {
        const pairs = [];
        for (const item of this._params.entries()) {
            for (const value of item[1].values()) {
                pairs.push([item[0], value as string]);
            }
        }
        return pairs;
    }

    add(key: string, value: string) {
        if (!this._params.has(key)) {
            this._params.set(key, new Set());
        }
        this._params.get(key)?.add(value);
        return this;
    }

    addAll(params: [key: string, value: string][]) {
        if (params) {
            params.forEach((item) => this.add(item[0], item[1]));
        }
        return this;
    }

    remove(key: string, value: string) {
        if (this._params.has(key)) {
            const elem = this._params.get(key);
            if (elem) {
                elem.delete(value);
                if (elem.size === 0) {
                    this._params.delete(key);
                }
            }
        }
        return this;
    }

    replace(key: string, value: string) {
        if (!this._params.has(key)) {
            this._params.set(key, new Set());
        }
        const elem = this._params.get(key);
        elem?.clear();
        elem?.add(value);
        return this;
    }
}