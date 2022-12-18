import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/Product";
import * as ProductCard from "./productCard";

const prod1: Product = {
    id: 1,
    title: "iPhone 9",
    description: "An apple mobile which is nothing like apple",
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    brand: "Apple",
    category: "smartphones",
    thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    images: [
        "https://i.dummyjson.com/data/products/1/1.jpg",
        "https://i.dummyjson.com/data/products/1/2.jpg",
        "https://i.dummyjson.com/data/products/1/3.jpg",
        "https://i.dummyjson.com/data/products/1/4.jpg",
        "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
    ]
};
const prod2: Product = {
    id: 2,
    title: "iPhone X",
    description: "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    stock: 34,
    brand: "Apple",
    category: "smartphones",
    thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
    images: [
        "https://i.dummyjson.com/data/products/2/1.jpg",
        "https://i.dummyjson.com/data/products/2/2.jpg",
        "https://i.dummyjson.com/data/products/2/3.jpg",
        "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
    ]
};


export class MainView extends AbstractView {
    constructor() {
        super();
    }

    async getView(): Promise<HTMLElement> {


        let content = document.createElement('div') as HTMLElement;
        content.classList.add('content__table', 'table');
        content.innerHTML = `
            <aside class="table__filters">
                <div class="table__filter category">Category</div>
                <div class="table__filter brand">Brand</div>
                <div class="table__filter price">Price</div>
                <div class="table__filter stock">Stock</div>
            </aside>
            <section class="table__products">
                <div class="table__view">
                </div>
                <div class="table__list">
                    <a href="#product">Product</a>
                </div>
            </section>`;
        return content;
    }

    renderView(): void {

        const fragment = document.createDocumentFragment();
        const cardTemp = ProductCard.createTemplate();

        for (let i = 0; i < 8; i += 1) {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            if (i % 2) {
                ProductCard.setData(card, prod1);
            } else {
                ProductCard.setData(card, prod2);
            }
            fragment.append(card);
        }

        const parent = document.querySelector('.table__list') as HTMLElement;
        parent.innerHTML = '';
        parent.appendChild(fragment);

    }
}