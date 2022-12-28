import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import { createFilterList, FilterListItem } from "./filterList";
import { Cart } from "../cartView/cart/cart";
import { ProductsParams, ModelState } from "../../model/dataModel";

export class MainView extends AbstractView {

    private _cart: Cart;
    private _brand: Set<string>;
    requestUpdateParams!: (params: ProductsParams) => void;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
        this._brand = new Set<string>();
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

    draw(data: ModelState): void {
        this.setParams(data);

        const fragment = document.createDocumentFragment();
        const cardTemp = ProductCard.createTemplate();

        data.products.forEach(item => {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            ProductCard.setData(card, item);
            fragment.append(card);
            card.addEventListener('click', (e: Event) => {
                const target = e.target! as HTMLElement;
                if (target.closest('button')) {
                    e.preventDefault();
                    this._cart.addToCart(item);
                }
            });
        });

        const parent = document.querySelector('.table__list') as HTMLElement;
        parent.innerHTML = '';
        parent.appendChild(fragment);

        const getFilterList = (dataAll: string[], dataFilter: string[]) => {
            const filterList: FilterListItem[] = [];
            dataAll.forEach((item) => {
                filterList.push({ name: item, checked: dataFilter.includes(item) });
            });
            return filterList;
        }

        this.drawCategories(getFilterList(data.categories, []));
        this.drawBrands(getFilterList(data.brands, data.filters.brand));
    }

    drawCategories(categories: FilterListItem[]) {
        const box = document.querySelector('.category') as HTMLElement;
        box.innerHTML = '';
        const list = createFilterList(categories);
        box.append(list);
    }

    drawBrands(brands: FilterListItem[]) {
        const box = document.querySelector('.brand') as HTMLElement;
        box.innerHTML = '';
        const list = createFilterList(brands);
        box.append(list);
        list.addEventListener('click', (event) => {
            if (event.target instanceof HTMLInputElement) {
                const elem = event.target as HTMLInputElement;
                if (elem.dataset.name) {
                    (elem.checked) ? this._brand.add(elem.dataset.name) : this._brand.delete(elem.dataset.name);
                }
                this.updateParams();
            }
        })
    }

    private updateParams() {
        this.requestUpdateParams(
            {
                filters: {
                    brand: [...this._brand]
                }
            }
        );
    }

    private setParams(state: ModelState) {
        this._brand.clear();
        state.filters.brand.forEach((item) => {
            this._brand.add(item);
        })

    }
}