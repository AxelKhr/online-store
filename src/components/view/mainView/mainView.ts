import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import { createFilterList, FilterListItem } from "./filterList";
import { FilterDualSlider, FilterSliderData } from "./filterSlider";
import { InputSearch, InputSearchData } from "./inputSearch";
import { Cart } from "../cartView/cart/cart";
import { ModelMainState } from "../../model/modelMain";
import { ListParams } from "../../model/filterList";
import Params from "../../utils/params";
import createButtonGeneral from "../elements/buttons/general";
import { SortList, SortListData } from "./sortList";
import { ViewControl } from "./viewControl";

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
        const filtersControl = document.createElement('div');
        filtersControl.classList.add('filter__control');
        const buttonFilterReset = createButtonGeneral('control__button-reset');
        buttonFilterReset.textContent = 'Reset';
        buttonFilterReset.addEventListener('click', () => {
            this.resetFilters();
            this.requestUpdateParams(this._params);
        });
        const buttonFilterCopy = createButtonGeneral('control__button-copy');
        buttonFilterCopy.textContent = 'Copy';
        buttonFilterCopy.addEventListener('click', () => {
            buttonFilterCopy.classList.add('button-copy--active');
            navigator.clipboard.writeText(window.location.href);
            setTimeout(() => {
                buttonFilterCopy.classList.remove('button-copy--active');
            }, 1000);
        });
        filtersControl.append(buttonFilterReset, buttonFilterCopy);
        aside.append(
            filtersControl,
            createFilterBlock('Search', 'search'),
            createFilterBlock('Category', 'category'),
            createFilterBlock('Brand', 'brand'),
            createFilterBlock('Price', 'price'),
            createFilterBlock('Stock', 'stock')
        );
        const section = document.createElement('section');
        section.classList.add('table__products');
        const tableControl = document.createElement('div');
        tableControl.classList.add('table__control');
        const controlSort = document.createElement('div');
        controlSort.classList.add('control__sorting');
        const controlCount = document.createElement('div');
        controlCount.classList.add('control__count');
        const controlView = document.createElement('div');
        controlView.classList.add('control__view');
        tableControl.append(controlSort, controlCount, controlView);
        const table = document.createElement('div');
        table.classList.add('table__list');
        const boxNotFound = document.createElement('div');
        boxNotFound.classList.add('products__not-found');
        boxNotFound.textContent = 'Items not found';
        section.append(tableControl, boxNotFound, table);
        content.append(aside, section);
        return content;
    }

    private checkCart(item: Product) {
        return (this._cart.cartData.findIndex((elem) => elem.product.id === item.id) >= 0);
    }

    draw(data: ModelMainState): void {
        this.setParams(data);
        const fragment = document.createDocumentFragment();
        const cardTemp = ProductCard.createTemplate();
        data.productsList.forEach(item => {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            ProductCard.setData(card, item, this.checkCart(item));
            fragment.append(card);
            card.addEventListener('click', (e: Event) => {
                const target = e.target! as HTMLElement;
                if (target.closest('button')) {
                    e.preventDefault();
                    if (this.checkCart(item)) {
                        this._cart.removeFromCart(item);
                    } else {
                        this._cart.addToCart(item);
                    }
                    ProductCard.setButtonStatus(target, this.checkCart(item));
                }
            });
        });

        const parent = document.querySelector('.table__list') as HTMLElement;
        parent.innerHTML = '';
        parent.appendChild(fragment);

        const productCount = document.querySelector('.control__count') as HTMLDivElement;
        productCount.textContent = `Found: ${data.productsList.length}`;

        const boxNotFound = document.querySelector('.products__not-found') as HTMLDivElement;
        if (data.productsList.length > 0) {
            boxNotFound.classList.add('block--hidden');
        } else {
            boxNotFound.classList.remove('block--hidden');
        }

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

        this.drawFilterList(getFilterList(data.params.category), 'category', 'category');
        this.drawFilterList(getFilterList(data.params.brand), 'brand', 'brand');
        this.drawFilterSlider({
            step: data.params.price.step,
            rangeMin: data.params.price.rangeMin,
            rangeMax: data.params.price.rangeMax,
            currMin: data.params.price.currMin,
            currMax: data.params.price.currMax
        }, 'price', 'price');
        this.drawFilterSlider({
            step: data.params.stock.step,
            rangeMin: data.params.stock.rangeMin,
            rangeMax: data.params.stock.rangeMax,
            currMin: data.params.stock.currMin,
            currMax: data.params.stock.currMax
        }, 'stock', 'stock');

        this.drawSearch({
            type: data.params.search.type,
            value: data.params.search.value,
        });
        this.drawSorting(data.params.sorting.list, data.params.sorting.current);
        this.drawViewButtons(data.params.view);
        this.setTableView();
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

    drawSorting(data: SortListData, current: string) {
        const box = document.querySelector('.control__sorting') as HTMLElement;
        box.innerHTML = '';
        const sorting = new SortList(data, current);
        box.append(sorting.content);
        sorting.onChange = (value) => {
            this._params.replace('sort', value);
            this.requestUpdateParams(this._params);
        }
    }

    drawViewButtons(value: string) {
        const box = document.querySelector('.control__view') as HTMLElement;
        box.innerHTML = '';
        const viewButtons = new ViewControl(value);
        box.append(viewButtons.content);
        viewButtons.onChange = (value) => {
            if (value !== 'grid') {
                this._params.replace('view', value);
            } else {
                this._params.remove('view');
            }
            this.requestUpdateParams(this._params);
        }
    }

    setTableView() {
        const viewType = this._params.get('view');
        const table = document.querySelector('.table__list') as HTMLElement;
        const cards = document.querySelectorAll('.products__card');
        let viewList = [...table.classList].filter((item) => item.match(/^table-view--/));
        if (viewType.length > 0) {
            viewList = viewList.filter((item) => !item.includes(viewType));
            table.classList.add(`table-view--${viewType}`);
            cards.forEach((card) => card.classList.add(`table-view--${viewType}`))
        }
        table.classList.remove(...viewList);
        cards.forEach((card) => card.classList.remove(...viewList));
    }

    private setParams(state: ModelMainState) {
        this._params.clear();
        state.params.category.forEach((item) => {
            item.checked && this._params.add('category', item.name);
        })
        state.params.brand.forEach((item) => {
            item.checked && this._params.add('brand', item.name);
        })
        if (state.params.price.minEn) {
            this._params.replace('price-min', state.params.price.currMin.toString());
        }
        if (state.params.price.maxEn) {
            this._params.replace('price-max', state.params.price.currMax.toString());
        }
        if (state.params.stock.minEn) {
            this._params.replace('stock-min', state.params.stock.currMin.toString());
        }
        if (state.params.stock.maxEn) {
            this._params.replace('stock-max', state.params.stock.currMax.toString());
        }
        if (state.params.search.enable) {
            this._params.add('search-type', state.params.search.type);
            this._params.add('search', state.params.search.value);
        }
        if (state.params.sorting.enable) {
            this._params.replace('sort', state.params.sorting.current);
        } else {
            this._params.remove('sort');
        }
        if ((state.params.view.length > 0) && (state.params.view !== 'grid')) {
            this._params.replace('view', state.params.view);
        } else {
            this._params.remove('view');
        }
    }

    resetFilters() {
        this._params.remove('category');
        this._params.remove('brand');
        this._params.remove('price-min');
        this._params.remove('price-max');
        this._params.remove('stock-min');
        this._params.remove('stock-max');
        this._params.remove('search-type');
        this._params.remove('search');
    }
}