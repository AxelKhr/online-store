import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import { createFilterList, FilterListItem } from "./filterList";
import { FilterDualSlider, FilterSliderData } from "./filterSlider";
import { Cart } from "../cartView/cart/cart";
import { ModelState } from "../../model/dataModel";
import Params from "../../utils/params";

export class MainView extends AbstractView {

    private _cart: Cart;
    private _params: Params;
    requestUpdateParams!: (params: Params) => void;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
        this._params = new Params();
    }

    async getView(): Promise<HTMLElement> {
        let content = document.createElement('div') as HTMLElement;
        content.classList.add('content__table', 'table');
        content.innerHTML = `
            <aside class="table__filter">
                <div class="filter__box">
                    <p class="filter__title">Category</p>
                    <div class="filter__list-box category"></div>
                </div>
                <div class="filter__box">
                    <p class="filter__title">Brand</p>
                    <div class="filter__list-box brand"></div>
                </div>
                <div class="filter__box">
                    <p class="filter__title">Price</p>
                    <div class="filter__slider-box price"></div>
                </div>
                <div class="filter__box">
                    <p class="filter__title">Stock</p>
                    <div class="filter__slider-box stock"></div>
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

        data.main.products.forEach(item => {
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

        this.drawCategories(getFilterList(data.main.categories, data.main.params.category));
        this.drawBrands(getFilterList(data.main.brands, data.main.params.brand));
        this.drawPrice({
            step: data.main.params.price.step,
            rangeMin: data.main.params.price.rangeMin,
            rangeMax: data.main.params.price.rangeMax,
            currMin: data.main.params.price.currMin,
            currMax: data.main.params.price.currMax
        });
        this.drawStock({
            step: data.main.params.stock.step,
            rangeMin: data.main.params.stock.rangeMin,
            rangeMax: data.main.params.stock.rangeMax,
            currMin: data.main.params.stock.currMin,
            currMax: data.main.params.stock.currMax
        });
    }

    drawCategories(categories: FilterListItem[]) {
        const box = document.querySelector('.category') as HTMLElement;
        box.innerHTML = '';
        const list = createFilterList(categories);
        box.append(list);
        list.addEventListener('click', (event) => {
            if (event.target instanceof HTMLInputElement) {
                const elem = event.target as HTMLInputElement;
                if (elem.dataset.name) {
                    if (elem.checked) {
                        this._params.add('category', elem.dataset.name);
                    } else {
                        this._params.remove('category', elem.dataset.name)
                    };
                }
                this.requestUpdateParams(this._params);
            }
        })
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
                    if (elem.checked) {
                        this._params.add('brand', elem.dataset.name);
                    } else {
                        this._params.remove('brand', elem.dataset.name)
                    };
                }
                this.requestUpdateParams(this._params);
            }
        })
    }

    drawPrice(data: FilterSliderData) {
        const box = document.querySelector('.price') as HTMLElement;
        box.innerHTML = '';
        const slider = new FilterDualSlider(data);
        box.append(slider.content);
        slider.setData(data);
        slider.onChangeMin = (min) => {
            this._params.replace('price-min', min.toString());
            this.requestUpdateParams(this._params);
            console.log('price-min');
        }
        slider.onChangeMax = (max) => {
            this._params.replace('price-max', max.toString());
            this.requestUpdateParams(this._params);
        }
    }

    drawStock(data: FilterSliderData) {
        const box = document.querySelector('.stock') as HTMLElement;
        box.innerHTML = '';
        const slider = new FilterDualSlider(data);
        box.append(slider.content);
        slider.setData(data);
        slider.onChangeMin = (min) => {
            this._params.replace('stock-min', min.toString());
            this.requestUpdateParams(this._params);
            console.log('stock-min');
        }
        slider.onChangeMax = (max) => {
            this._params.replace('stock-max', max.toString());
            this.requestUpdateParams(this._params);
        }
    }

    private setParams(state: ModelState) {
        this._params.clear();
        state.main.params.category.forEach((item) => {
            this._params.add('category', item);
        })
        state.main.params.brand.forEach((item) => {
            this._params.add('brand', item);
        })
        if (state.main.params.price.minEn) {
            this._params.replace('price-min', state.main.params.price.currMin.toString());
        }
        if (state.main.params.price.maxEn) {
            this._params.replace('price-max', state.main.params.price.currMax.toString());
        }
        if (state.main.params.stock.minEn) {
            this._params.replace('stock-min', state.main.params.stock.currMin.toString());
        }
        if (state.main.params.stock.maxEn) {
            this._params.replace('stock-max', state.main.params.stock.currMax.toString());
        }
    }
}