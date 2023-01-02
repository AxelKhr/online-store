import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import { createFilterList, FilterListItem } from "./filterList";
import { FilterDualSlider, FilterSliderData } from "./filterSlider";
import { InputSearch, InputSearchData } from "./inputSearch";
import { Cart } from "../cartView/cart/cart";
import { ModelState, ListParams } from "../../model/dataModel";
import Params from "../../utils/params";

const createFilterBlock = (title: string, selClass: string) => {
    const block = document.createElement('div');
    block.classList.add('filter__block');
    const titleElem = document.createElement('p');
    titleElem.classList.add('filter__title');
    titleElem.textContent = title;
    const box = document.createElement('div');
    box.classList.add('filter__box', selClass);
    block.append(titleElem, box);
    return block;
}

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
        const aside = document.createElement('aside');
        aside.classList.add('table__filter');
        aside.append(
            createFilterBlock('Search', 'search'),
            createFilterBlock('Category', 'category'),
            createFilterBlock('Brand', 'brand'),
            createFilterBlock('Price', 'price'),
            createFilterBlock('Stock', 'stock')
        );
        const section = document.createElement('section');
        section.classList.add('table__products');
        const table = document.createElement('div');
        table.classList.add('table__list');
        section.append(table);
        content.append(aside, section);
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

        const getFilterList = (data: ListParams) => {
            const filterList: FilterListItem[] = [];
            data.forEach((item) => {
                filterList.push({
                    name: item.name,
                    count: item.count,
                    total: item.total,
                    checked: item.checked
                });
            });
            return filterList;
        }

        this.drawFilterList(getFilterList(data.main.params.category), 'category', 'category');
        this.drawFilterList(getFilterList(data.main.params.brand), 'brand', 'brand');
        this.drawFilterSlider({
            step: data.main.params.price.step,
            rangeMin: data.main.params.price.rangeMin,
            rangeMax: data.main.params.price.rangeMax,
            currMin: data.main.params.price.currMin,
            currMax: data.main.params.price.currMax
        }, 'price', 'price');
        this.drawFilterSlider({
            step: data.main.params.stock.step,
            rangeMin: data.main.params.stock.rangeMin,
            rangeMax: data.main.params.stock.rangeMax,
            currMin: data.main.params.stock.currMin,
            currMax: data.main.params.stock.currMax
        }, 'stock', 'stock');

        this.drawSearch({
            type: data.main.params.search.type,
            value: data.main.params.search.value,
        });
    }

    drawFilterList(data: FilterListItem[], selClass: string, paramName: string) {
        const box = document.querySelector(`.${selClass}`) as HTMLElement;
        box.innerHTML = '';
        const list = createFilterList(data);
        box.append(list);
        list.addEventListener('click', (event) => {
            if (event.target instanceof HTMLInputElement) {
                const elem = event.target as HTMLInputElement;
                if (elem.dataset.name) {
                    if (elem.checked) {
                        this._params.add(paramName, elem.dataset.name);
                    } else {
                        this._params.remove(paramName, elem.dataset.name)
                    };
                }
                this.requestUpdateParams(this._params);
            }
        })
    }

    drawFilterSlider(data: FilterSliderData, selClass: string, paramName: string) {
        const box = document.querySelector(`.${selClass}`) as HTMLElement;
        box.innerHTML = '';
        const slider = new FilterDualSlider(data);
        box.append(slider.content);
        slider.setData(data);
        slider.onChangeMin = (min) => {
            this._params.replace(`${paramName}-min`, min.toString());
            this.requestUpdateParams(this._params);
        }
        slider.onChangeMax = (max) => {
            this._params.replace(`${paramName}-max`, max.toString());
            this.requestUpdateParams(this._params);
        }
    }

    drawSearch(data: InputSearchData) {
        const box = document.querySelector('.search') as HTMLElement;
        box.innerHTML = '';
        const search = new InputSearch();
        box.append(search.content);
        search.setData(data);
        search.onChange = (type, value) => {
            this._params.remove('search-type');
            this._params.remove('search');
            if (value.length > 0) {
                this._params.add('search-type', type);
                this._params.add('search', value);
            }
            this.requestUpdateParams(this._params);
        };
    }

    private setParams(state: ModelState) {
        this._params.clear();
        state.main.params.category.forEach((item) => {
            item.checked && this._params.add('category', item.name);
        })
        state.main.params.brand.forEach((item) => {
            item.checked && this._params.add('brand', item.name);
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
        if (state.main.params.search.enable) {
            this._params.add('search-type', state.main.params.search.type);
            this._params.add('search', state.main.params.search.value);
        }
    }
}