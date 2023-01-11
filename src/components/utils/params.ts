export class Params {
    private _params: Map<string, Set<string>>;
    private _canUpdateURL: boolean;

    constructor(params?: [key: string, value: string][]) {
        this._params = new Map();
        this._canUpdateURL = false;
        if (params) {
            this.addAll(params);
        }
        this._canUpdateURL = true;
    }

    clear() {
        this._params.clear();
        this._canUpdateURL && setParamsToURL(this);
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
        this._canUpdateURL && setParamsToURL(this);
        return this;
    }

    addAll(params: [key: string, value: string][]) {

        if (params) {
            params.forEach((item) => this.add(item[0], item[1]));
        }
        this._canUpdateURL && setParamsToURL(this);
        return this;
    }

    remove(key: string, value?: string) {
        if (value) {
            if (this._params.has(key)) {
                const elem = this._params.get(key);
                if (elem) {
                    elem.delete(value);
                    if (elem.size === 0) {
                        this._params.delete(key);
                    }
                }
            }
        } else {
            this._params.delete(key);
        }
        this._canUpdateURL && setParamsToURL(this);
        return this;
    }

    replace(key: string, value: string) {
        if (!this._params.has(key)) {
            this._params.set(key, new Set());
        }
        const elem = this._params.get(key);
        elem?.clear();
        elem?.add(value);
        this._canUpdateURL && setParamsToURL(this);
        return this;
    }

    setUpdateURLState(canUpdateURL: boolean) {
        this._canUpdateURL = canUpdateURL;
    }
}

export function setParamsToURL(params: Params, canReplace?: boolean) {
    const paramsStr = (new URLSearchParams(params.getPairs())).toString();
    const path = window.location.href.split('?')[0] + ((paramsStr.length) ? '?' + paramsStr : '');
    if (path !== window.location.href) {
        if (canReplace) {
            window.history.replaceState({}, '', path);
        } else {
            window.history.pushState({}, '', path);
        }
    }
}

export function getParamsFromURL(url: string): Params {
    const urlParams = (url.split('?')[1] || '');
    return new Params([...(new URLSearchParams(urlParams)).entries()]);
}
