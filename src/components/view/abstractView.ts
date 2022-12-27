import { Product, ProductResponse } from "../interface/product";
import { ModelState } from "../model/dataModel";

export abstract class AbstractView {
    constructor() {
        document.title = 'Online store';
    }

    setTitle(title: string) {
        document.title = title;
    }

    abstract getView(): Promise<HTMLElement>;

    //    abstract draw(data?: Product[] | Product | ProductResponse): void;
    abstract draw(data: ModelState): void;
}