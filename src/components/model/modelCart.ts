import Params from "../utils/params";

export const CART_VIEW_LIMIT_DEFAULT = 3;
export const CART_VIEW_PAGE_DEFAULT = 1;

export interface ModelCartState {
    limit: number;
    page: number;
    isModalEnable: boolean;
}

export class ModelCart {
    private _limit: number;
    private _page: number;
    private _isModalEnable: boolean;
    private _updateCartEvent: Event;

    constructor() {
        this._limit = CART_VIEW_LIMIT_DEFAULT;
        this._page = CART_VIEW_PAGE_DEFAULT;
        this._isModalEnable = false;
        this._updateCartEvent = new Event('changemodelcart');
    }

    get state(): ModelCartState {
        const res: ModelCartState = {
            limit: this._limit,
            page: this._page,
            isModalEnable: this._isModalEnable
        }
        this._isModalEnable = false;
        return res;
    }

    setParams(params: Params) {
        const limit = params.get('limit');
        this._limit = (limit.length > 0) ? +limit : CART_VIEW_LIMIT_DEFAULT;
        const page = params.get('page');
        this._page = (page.length > 0) ? +page : CART_VIEW_PAGE_DEFAULT;
        document.dispatchEvent(this._updateCartEvent);
    }

    setModalWindowState(isEnable: boolean) {
        this._isModalEnable = true;
    }
}


