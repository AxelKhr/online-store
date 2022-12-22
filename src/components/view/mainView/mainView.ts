import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import * as FilterList from "./filterList";

export class MainView extends AbstractView {
    
    private cartItems!: Set<string>;
    private cart!: HTMLElement;
    private totalSum!: HTMLElement; 

    constructor() {
        super();
        this.initView();
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

    draw(data: Product[]): void {
        const categories = new Set<string>();
        const brands = new Set<string>();
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
                    this.addToCart(item);
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

    initView() {
        const data = JSON.parse(localStorage.getItem('cart-items')!);
        (data !== null) ? this.cartItems = new Set<string>(Array.from(data)) : this.cartItems = new Set<string>();
        this.cart = document.querySelector('.indicator__span') as HTMLElement;
        this.totalSum = document.querySelector('#total') as HTMLElement;
        this.cart.innerText = `${this.cartItems.size}`;
        let sum = 0;
        this.cartItems.forEach(el => {
            sum += JSON.parse(el).price;
        });
        this.totalSum.innerText! = `${sum}`;
    }

    addToCart(item: Product): void {
        const itemStr = JSON.stringify(item);
        const cartSize = this.cartItems.size;
        this.cartItems.add(itemStr);
        if(cartSize !== this.cartItems.size) {
            localStorage.setItem('cart-items', JSON.stringify(Array.from(this.cartItems)));
            this.cart.innerText! = `${this.cartItems.size}`;
            let sum = Number(this.totalSum.innerText);
            sum += item.price;
            this.totalSum.innerText! = `${sum}`;
        }
    }

}