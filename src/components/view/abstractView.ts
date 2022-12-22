import { Product, ProductResponse } from "../interface/product";

export abstract class AbstractView {
    constructor() {
        document.title = 'Online store';
    }

    setTitle(title: string) {
        document.title = title;
    }

    abstract getView(): Promise<HTMLElement>;

    abstract draw(data?: Product[] | Product | ProductResponse): void;
}