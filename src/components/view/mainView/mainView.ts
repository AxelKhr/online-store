import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import * as FilterList from "./filterList";
import { Cart } from "../cartView/cart/cart";
import { ProductModel } from "../../model/ProductModel";

export class MainView extends AbstractView {

    private cart: Cart;

    constructor(cart: Cart) {
        super();
        this.cart = cart;
    }

    async getView(): Promise<HTMLElement> {
        let content = document.createElement('div') as HTMLElement;
        content.classList.add('content__table', 'table');
        content.innerHTML = `
            <aside class="table__filters">
                <div class="table__filter">
                    <p class="filter__title">Category</p>
                    <div class="filter__list-box category"></div>
                </div>
                <div class="table__filter">
                    <p class="filter__title">Brand</p>
                    <div class="filter__list-box brand"></div>
                </div>
                <div class="table__filter price">
                    <p class="filter__title">Price</p>
                </div>
                <div class="table__filter stock">
                    <p class="filter__title">Stock</p>
                </div>
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

    draw(model: ProductModel): void {
        const data = model.getProducts();
        const categories = model.getCategories();
        const brands = model.getBrands();
        
        const fragment = document.createDocumentFragment();
        const cardTemp = ProductCard.createTemplate();

        data.forEach(item => {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            ProductCard.setData(card, item);
            fragment.append(card);
            categories.add(item.category);
            brands.add(item.brand);
            card.addEventListener('click', (e: Event) => {
                const target = e.target! as HTMLElement;
                if(target.closest('button')) {
                    e.preventDefault();
                    this.cart.addToCart(item);
                }
            });
        });

        const parent = document.querySelector('.table__list') as HTMLElement;
        parent.innerHTML = '';
        parent.appendChild(fragment);

        this.drawCategories(categories);
        this.drawBrands(brands);
    }

    drawCategories(categories: Set<string>) {
        const box = document.querySelector('.category') as HTMLElement;
        box.innerHTML = '';
        const list = FilterList.createFilterList(categories);
        box.append(list);
    }

    drawBrands(brands: Set<string>) {
        const box = document.querySelector('.brand') as HTMLElement;
        box.innerHTML = '';
        const list = FilterList.createFilterList(brands);
        box.append(list);
    }

}