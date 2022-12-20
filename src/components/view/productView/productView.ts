import { Product, ProductResponse } from "../../interface/product";
import { AbstractView } from "../abstractView";

export class ProductView extends AbstractView {

    async getView(): Promise<HTMLElement> {
        let content = document.createElement('section') as HTMLElement;
        content.classList.add('product-page');
        content.innerHTML = `<span>Product page</span>`;
        return content;
    }

    draw(data: Product[]): void {
        console.log(data);
    }
 
}