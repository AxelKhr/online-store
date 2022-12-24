import { Product, ProductResponse } from "../interface/product";
import { ProductModel } from "../model/ProductModel";

export abstract class AbstractView {

    private attribute: string;

    constructor() {
        document.title = 'Online store';
        this.attribute = '';
    }

    setTitle(title: string) {
        document.title = title;
    }

    setAttribute(attribute: string) {
        this.attribute = attribute;
    }

    getAttrubute() {
        return this.attribute;
    }

    abstract getView(): Promise<HTMLElement>;

    abstract draw(model: ProductModel): void;
}