import "./style.scss";
import { AbstractView } from "../abstractView";
import * as CartItem from "./cartItem";
import { Product } from "../../interface/product";
import { createOrderBlock, getApplyPromo, getPromo, payOrder } from "./orderBlock";
import { getModal } from "./modal";
import { Cart, CartData } from "./cart/cart";
import { PromoCode } from "../../enum/promo";
import { Params, getParamsFromURL } from "../../utils/params";
import * as ModelCart from "../../model/modelCart";
import { PaginationHelper } from "../../utils/pagination";

export interface Promo {
    id: string;
    name: string;
    discount: number;
}

export class CartView extends AbstractView {

    private _cart: Cart;
    private readonly rsPromo: Promo;
    private readonly epmPromo: Promo;
    private promos: Promo[];
    private _params: Params;
    requestUpdateParams!: () => void;

    private _limit!: number;
    private _page!: number;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
        const dataLoaded = localStorage.getItem('promo');
        const data = (dataLoaded) ? JSON.parse(dataLoaded) : null;
        this.promos = (data !== null) ? Array.from(data) : [];
        this.rsPromo = { id: PromoCode.RS, name: 'Rolling Scopes School - 10%', discount: 10 };
        this.epmPromo = { id: PromoCode.EPM, name: 'EPAM Systems - 10%', discount: 10 };
        this._params = new Params();
    }

    async getView(): Promise<HTMLElement> {
        const content = document.createElement('section') as HTMLElement;
        content.dataset.name = 'viewCart';
        content.classList.add('cart-page');
        content.innerHTML = this.getEmptyCart();
        return content;
    }

    draw(): void {
        const parent = document.querySelector('.cart-page') as HTMLElement;
        if (this._cart.cartData.length !== 0) {
            parent.innerHTML =
                `<section class="cart__products">
                    <div class="cart__box">
                        <div class="cart__control"></div>
                        <div class="cart__list"></div>
                    </div>
                    <div class="cart__order"></div>
                    <div class="modal hidden"></div>
                </section>`;
            const cart = document.querySelector('.cart__list') as HTMLElement;
            const pageControl = document.querySelector('.cart__control') as HTMLElement;

            this.drawControl(cart, pageControl);
            this.drawCards(cart);
            this.drawOrder();

            const modal = document.querySelector('.modal__shadow') as HTMLElement;
            modal.innerHTML = '';
            modal.append(getModal());
        }
    }

    private drawControl(cart: HTMLElement, parent: HTMLElement) {
        parent.innerHTML = '';
        const limit = document.createElement('input');
        limit.classList.add('page-limit');
        limit.type = 'number';
        if (this._limit !== undefined) limit.value = this._limit.toString();
        limit.addEventListener('change', () => {
            this._params.replace('limit', limit.value);
            this.requestUpdateParams();
            this.drawCards(cart);
        });

        const page = document.createElement('span');
        const totalPage = document.createElement('span');
        const helper = new PaginationHelper(this._cart.cartData, this._limit);
        totalPage.innerText = `/${helper.pageCount().toString()}`;

        page.classList.add('page-current');
        if (this._page !== undefined) {
            page.innerText = this._page.toString();
        }

        const leftPageBtn = document.createElement('button');
        const rightPageBtn = document.createElement('button');
        leftPageBtn.classList.add('control-btn');
        leftPageBtn.innerText = '<';
        leftPageBtn.addEventListener('click', () => {
            if (this._page !== 1) {
                this._page--;
                page.innerText = this._page.toString();
                this._params.replace('page', page.innerText);
                this.requestUpdateParams();
                this.drawCards(cart);
            }
        });

        if (this._page > helper.pageCount()) {
            --this._page;
            page.innerText = this._page.toString();
            this._params.replace('page', page.innerText);
        }

        rightPageBtn.classList.add('control-btn');
        rightPageBtn.innerText = '>';
        rightPageBtn.addEventListener('click', () => {
            if (this._page !== helper.pageCount()) {
                this._page++;
                page.innerText = this._page.toString();
                this._params.replace('page', page.innerText);
                this.requestUpdateParams();
                this.drawCards(cart);
            }
        });
        parent.append(limit, leftPageBtn, page, totalPage, rightPageBtn);
    }

    private drawCards(cart: HTMLElement) {
        const cardTemp = CartItem.createTemplate();
        cart.innerHTML = "";
        const fragment = document.createDocumentFragment();
        const startIndex = (this._page * this._limit) - this._limit;
        for (let i = startIndex; (i < this._page * this._limit && i < this._cart.cartData.length); i++) {
            const card = cardTemp.cloneNode(true) as HTMLElement;
            card.classList.add('products__card');
            CartItem.setData(card, this._cart.cartData[i], i + 1);
            fragment.append(card);
            card.addEventListener('click', (e: Event) => this.clickItem(e, this._cart.cartData[i]));
        }
        cart.appendChild(fragment);
    }

    private drawOrder() {
        const order = document.querySelector('.cart__order') as HTMLElement;
        order.innerHTML = '';
        order.append(createOrderBlock(this._cart.cartData));

        if (this.promos.length !== 0) {
            this.calcDiscount();
        }

        const orderParent = document.querySelector('.order__promo-content') as HTMLElement;
        const orderInput = document.querySelector('.order__promo') as HTMLInputElement;
        orderInput.addEventListener('input', (e) => this.findPromo(e, orderParent));

        const applyParent = document.querySelector('.order__apply-promo-box') as HTMLElement;
        this.promos.forEach(el => getApplyPromo(applyParent, el));
        applyParent.addEventListener('click', (e) => this.removePromo(e, applyParent));
    }

    private clickItem(e: Event, data: CartData) {
        const titleNum = document.getElementById(`count-${data.product.id}`) as HTMLElement;
        const orderPrice = document.querySelector('.order__cost') as HTMLElement;
        const target = e.target as HTMLElement;
        if (target.closest('.product-cart__button')) {
            this.removeFromCart(e, data.product);
        } else {
            if (target.closest('.order-num__btn-right')) {
                e.preventDefault();
                data.count++;
                if (data.count > data.product.stock) {
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) + 1}`;
                orderPrice.innerText = `Total: ${this._cart.plusNumber(data)}`;
                this.incrementCount(data);
                this.calcDiscount();
            } else if (target.closest('.order-num__btn-left')) {
                e.preventDefault();
                data.count--;
                if (data.count < 1) {
                    this.removeFromCart(e, data.product);
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) - 1}`;
                orderPrice.innerText = `Total: ${this._cart.minusNumber(data)}`;
                this.incrementCount(data);
                this.calcDiscount();
            }
        }
    }

    private incrementCount(data: CartData) {
        const price = document.getElementById(`price-${data.product.id}`) as HTMLElement;

        const cartIcon = document.querySelector('.indicator__span') as HTMLElement;
        const orderProduct = document.querySelector('.order__count') as HTMLElement;

        price.innerText = `${data.product.price * data.count}`;
        orderProduct.innerText = `${cartIcon.innerText}`;
    }

    private removeFromCart(e: Event, product: Product) {
        const cart = document.querySelector('.cart__list') as HTMLElement;
        const parentBox = document.querySelector('.cart-page') as HTMLElement;
        const pageControl = document.querySelector('.cart__control') as HTMLElement;

        e.preventDefault();
        this._cart.removeFromCart(product);
        if (this._cart.getSize() === 0) {
            localStorage.removeItem('cart-storage');
            parentBox.innerHTML = this.getEmptyCart();
        } else {
            this.drawControl(cart, pageControl);
            this._params.replace('page', this._page.toString());
            this.requestUpdateParams();
            this.drawCards(cart);
            this.drawOrder();
        }
    }

    private findPromo(e: Event, parent: HTMLElement) {
        const input = (<HTMLTextAreaElement>e.target).value.toUpperCase();
        if (input == PromoCode.RS) {
            this.drawPromo(parent, this.rsPromo);
        } else if (input == PromoCode.EPM) {
            this.drawPromo(parent, this.epmPromo);
        } else {
            parent.innerHTML = '';
        }
    }

    private drawPromo(parent: HTMLElement, promo: Promo) {
        getPromo(parent, promo);
        const addBtn = document.querySelector('.order__promo-btn') as HTMLInputElement;
        if (!this.promos.find(el => el.id == promo.id)) {
            addBtn.classList.remove('hidden');
            addBtn.addEventListener('click', () => {
                this.promos.push(promo);
                localStorage.setItem('promo', JSON.stringify(this.promos));
                this.drawOrder();
            });
        } else {
            addBtn.classList.add('hidden');
        }
    }

    private removePromo(e: Event, parent: HTMLElement) {
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
            const promoName = `${target.id.split('-')[1]}`;
            const id = `promo-${promoName}`;
            const child = document.getElementById(id) as HTMLElement;
            this.promos = this.promos.filter(el => el.id !== promoName.toUpperCase());
            localStorage.setItem('promo', JSON.stringify(this.promos));
            parent.removeChild(child);
            this.drawOrder();
        }
    }

    private calcDiscount() {
        const promoCostTitle = document.querySelector('.order__promo-cost-title') as HTMLElement;
        const promoCost = document.querySelector('.order__promo-cost') as HTMLElement;
        const orderPrice = document.querySelector('.order__cost') as HTMLElement;
        const total = document.getElementById('total') as HTMLElement;
        if (this.promos.length !== 0) {
            orderPrice.classList.add('line');
            promoCostTitle.classList.remove('transparent');
        }
        const price = Number(total.innerText);
        const discount = this.promos.reduce((sum, acc) => sum + price * (acc.discount / 100), 0);
        promoCost.innerText = `${price - Math.round(discount)}`;
    }

    private getEmptyCart() {
        return `<div class="cart-message">
                    <span class="cart__text">Your cart is empty</span>
                    <a href="#" class="cart__btn">Go shopping</a>
                </div>`;
    }

    // for paging
    update(data: ModelCart.ModelCartState) {
        this._params = getParamsFromURL(window.location.href);

        const cart = document.querySelector('.cart__list') as HTMLElement;
        const pageControl = document.querySelector('.cart__control') as HTMLElement;

        const limit = document.querySelector('.page-limit') as HTMLInputElement;
        limit.value = data.limit.toString();
        this._limit = +limit.value;
        const page = document.querySelector('.page-current') as HTMLInputElement;
        page.innerText = data.page.toString();
        this._page = +page.innerText;
        const helper = new PaginationHelper(this._cart.cartData, this._limit);
        if (this._page > helper.pageCount()) {
            this._page = helper.pageCount();
            this._params.replace('page', this._page.toString());
        }
        pageControl.innerHTML = '';
        this.drawControl(cart, pageControl);
        this.drawCards(cart);

        data.isModalEnable && payOrder();
    }
}
