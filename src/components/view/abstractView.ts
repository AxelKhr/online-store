import { Product, ProductResponse } from "../interface/product";
import { ProductModel } from "../model/productModel";

export abstract class AbstractView {

    private attribute!: URLSearchParams;

    constructor() {
        document.title = 'Online store';
    }

    setTitle(title: string) {
        document.title = title;
    }

    setAttribute(attribute: URLSearchParams) {
        this.attribute = attribute;
    }

    getAttrubute(key: string) {
        return this.attribute.get(key);
    }

    abstract getView(): Promise<HTMLElement>;

    abstract draw(model: ProductModel): void;
}