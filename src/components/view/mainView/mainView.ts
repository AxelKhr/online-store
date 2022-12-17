import { Product } from "../../interface/product";
import { AbstractView } from "../abstractView";

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
            <section class="main__products"></section>`;
        return content;
    }

    draw(data: Product[]): void {
        const products = document.querySelector('.main__products');
        const categories = new Set<string>();
        const brands = new Set<string>();

        data.forEach((el) => {
            categories.add(el.category);
            brands.add(el.brand);
            const productItem = document.createElement('a');
            productItem.id = 'product';
            productItem.href = '#product'
            productItem.textContent = el.title;
            products?.appendChild(productItem);
        });
        this.drawCategories(categories);
        this.drawBrands(brands);

    }

    drawCategories(categories: Set<string>) {
        const category = document.querySelector('.category');
        categories.forEach((el) => {
            const productCategory = document.createElement('a');
            productCategory.id = 'pr-category';
            productCategory.textContent = el;
            category?.appendChild(productCategory);
        });
    }

    drawBrands(brands: Set<string>) {
        const brand = document.querySelector('.brand');
        brands.forEach((el) => {
            const productBrand = document.createElement('a');
            productBrand.id = 'pr-brand';
            productBrand.textContent = el;
            brand?.appendChild(productBrand);
        });
    }
}