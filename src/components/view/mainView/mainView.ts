import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import * as ProductCard from "./productCard";
import { FilterListItem, createFilterList, updateFilterList } from "./filterList";
import { FilterDualSlider, FilterSliderData } from "./filterSlider";
import { InputSearch, InputSearchData } from "./inputSearch";
import { Cart } from "../cartView/cart/cart";
import { ModelMainState } from "../../model/modelMain";
import { ListParams } from "../../model/filterList";
import { Params, getParamsFromURL } from "../../utils/params";
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
    private _sliders: Map<string, FilterDualSlider>;
    private _search!: InputSearch;
    private _sort!: SortList;
    requestUpdateParams!: () => void;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
        this._params = new Params();
        this._sliders = new Map();
    }

    async getView(): Promise<HTMLElement> {
        const content = document.createElement('div') as HTMLElement;
        content.dataset.name = 'viewMain';
        content.classList.add('content__table', 'table');

        const filterButton = document.createElement('button');
        filterButton.classList.add('table__filter-button', 'button--hidden');
        filterButton.textContent = 'F';
        content.append(filterButton);

        const aside = document.createElement('aside');
        aside.classList.add('table__filter');
        const filtersControl = document.createElement('div');
        filtersControl.classList.add('filter__control');
        const buttonFilterReset = createButtonGeneral('control__button-reset', 'btn-color--2');
        buttonFilterReset.textContent = 'Reset';
        buttonFilterReset.addEventListener('click', () => {
            this.resetFilters();
            this.requestUpdateParams();
        });
        const buttonFilterCopy = createButtonGeneral('control__button-copy', 'btn-color--2');
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

    updateTable(data: ModelMainState): void {
        this._params = getParamsFromURL(window.location.href);

        updateFilterList('category', getFilterList(data.params.category));
        updateFilterList('brand', getFilterList(data.params.brand));
        this._sliders.get('price')?.setData({
            step: data.params.price.step,
            rangeMin: data.params.price.rangeMin,
            rangeMax: data.params.price.rangeMax,
            currMin: data.params.price.currMin,
            currMax: data.params.price.currMax
        });
        this._sliders.get('stock')?.setData({
            step: data.params.stock.step,
            rangeMin: data.params.stock.rangeMin,
            rangeMax: data.params.stock.rangeMax,
            currMin: data.params.stock.currMin,
            currMax: data.params.stock.currMax
        });
        this._search.setData({
            type: data.params.search.type,
            value: data.params.search.value,
        });
        this._sort.setData(data.params.sorting.current);
        this.drawProducts(data.productsList);
        this.setTableView();
    }

    update(data: ModelMainState): void {
        this._params = getParamsFromURL(window.location.href);

        this.drawFilterList(getFilterList(data.params.category), 'category', 'category');
        this.drawFilterList(getFilterList(data.params.brand), 'brand', 'brand');
        this._sliders.clear();
        this._sliders.set('price',
            this.drawFilterSlider({
                step: data.params.price.step,
                rangeMin: data.params.price.rangeMin,
                rangeMax: data.params.price.rangeMax,
                currMin: data.params.price.currMin,
                currMax: data.params.price.currMax
            }, 'price', 'price'));
        this._sliders.set('stock',
            this.drawFilterSlider({
                step: data.params.stock.step,
                rangeMin: data.params.stock.rangeMin,
                rangeMax: data.params.stock.rangeMax,
                currMin: data.params.stock.currMin,
                currMax: data.params.stock.currMax
            }, 'stock', 'stock'));

        this._search = this.drawSearch({
            type: data.params.search.type,
            value: data.params.search.value,
        });
        this._sort = this.drawSorting(data.params.sorting.list, data.params.sorting.current);
        this.drawViewButtons(data.params.view);
        this.drawProducts(data.productsList);
        this.setTableView();
    }

    drawProducts(data: Product[]) {
        const productCount = document.querySelector('.control__count') as HTMLDivElement;
        productCount.textContent = `Found: ${data.length}`;

        const boxNotFound = document.querySelector('.products__not-found') as HTMLDivElement;
        if (data.length > 0) {
            boxNotFound.classList.add('block--hidden');
        } else {
            boxNotFound.classList.remove('block--hidden');
        }

        const fragment = document.createDocumentFragment();
        const cardTemp = ProductCard.createTemplate();
        data.forEach(item => {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            ProductCard.setData(card, item, this.checkCart(item));
            fragment.append(card);
            card.addEventListener('click', (e: Event) => {
                const target = (e.target! as HTMLElement).closest('.button-icon') as HTMLElement;
                if (target) {
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
                this.requestUpdateParams();
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
            this.requestUpdateParams();
        }
        slider.onChangeMax = (max) => {
            this._params.replace(`${paramName}-max`, max.toString());
            this.requestUpdateParams();
        }
        return slider;
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
            this.requestUpdateParams();
        };
        return search;
    }

    drawSorting(data: SortListData, current: string) {
        const box = document.querySelector('.control__sorting') as HTMLElement;
        box.innerHTML = '';
        const sorting = new SortList(data, current);
        box.append(sorting.content);
        sorting.onChange = (value) => {
            this._params.replace('sort', value);
            this.requestUpdateParams();
        }
        return sorting;
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
            this.requestUpdateParams();
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
