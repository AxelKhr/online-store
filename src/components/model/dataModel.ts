import { Product } from "../interface/product";

type Filters = {
  brand: string[];
}

type ModelState = {
  products: Product[];
  filters: Filters;
}

export interface ProductsParams {
  filters: {
    brand: string[];
  }
}

export class DataModel {
  private _products: Product[];
  private _updateEvent: Event;
  state: ModelState;

  constructor() {
    this._products = [];
    this._updateEvent = new Event('changemodel');

    this.state = {
      products: [],
      filters: {
        brand: []
      }
    };
  }

  getProductsData() {
    return this._products;
  }

  setProductsData(products: Product[]) {
    this._products = products;
  }

  setProductsParam(params: ProductsParams) {
    this.state.products = [];
    this._products.forEach((item) => {
      this.state.filters.brand = params.filters.brand;
      if (params.filters.brand.includes(item.brand)) {
        this.state.products.push(item);
      }
    });

    document.dispatchEvent(this._updateEvent);
  }
}