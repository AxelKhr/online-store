import { AbstractView } from "./abstractView";

export class MainView extends AbstractView {
    constructor() {
        super();
    }

    async getView(): Promise<HTMLElement> {
        let content = document.createElement('div') as HTMLElement;
        content.classList.add('main__content');
        content.innerHTML = `
            <aside class="main__filters">
                <div class="main__filter category">Category</div>
                <div class="main__filter brand">Brand</div>
                <div class="main__filter price">Price</div>
                <div class="main__filter stock">Stock</div>
            </aside>
            <section class="main__products">
                <a href="#product">Product</a>
            </section>`;
        return content;
    }
}