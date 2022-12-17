import { Product } from "../interface/product";

export abstract class AbstractView {
    constructor() {
        document.title = 'Online store';
    }

    setTitle(title: string) {
        document.title = title;
    }

    abstract getView(): Promise<HTMLElement>;

    draw(data: Product[]) { console.log(data) }
}