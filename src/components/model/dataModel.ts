import { Product } from "../interface/product";

export default class DataModel {
  private _products: Product[];

  constructor() {
    this._products = [];
  }

  getProductsData() {
    return this._products;
  }

  setProductsData(products: Product[]) {
    this._products = products;
  }

}