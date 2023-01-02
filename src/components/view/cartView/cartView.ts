import "./style.scss";
import { AbstractView } from "../abstractView";
import * as CartItem from "./cartItem";
import { Product } from "../../interface/product";
import { createOrderBlock, getApplyPromo, getPromo } from "./orderBlock";
import { getModal } from "./modal";
import { Cart, CartData } from "./cart/cart";
import { PromoCode } from "../../enum/promo";

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

    constructor(cart: Cart) {
        super();
        this._cart = cart;
        const data = JSON.parse(localStorage.getItem('promo')!);
        this.promos = (data !== null) ? Array.from(data) : [];
        this.rsPromo = { id: PromoCode.RS, name: 'Rolling Scopes School - 10%', discount: 10};
        this.epmPromo = { id: PromoCode.EPM, name: 'EPAM Systems - 10%', discount: 10};
    }
    
    async getView(): Promise<HTMLElement>  {
        let content = document.createElement('section') as HTMLElement;
        content.classList.add('cart-page');
        content.innerHTML = this.getEmptyCart();
        return content;
    }

    draw(): void {
        const parent = document.querySelector('.cart-page') as HTMLElement;
        if (this._cart.cartData.length !== 0) {
            const fragment = document.createDocumentFragment();
            const cardTemp = CartItem.createTemplate();

            this._cart.cartData.forEach(item => {
                const card = cardTemp.cloneNode(true) as HTMLElement;
                card.classList.add('products__card');
                CartItem.setData(card, item);
                fragment.append(card);
                card.addEventListener('click', (e: Event) => this.clickItem(e, item, parent));
            });

            parent.innerHTML = 
            `<section class="cart__products">
                <div class="cart__list"></div>
                <div class="cart__order"></div>
                <div class="modal hidden"></div>
            </section>`;
            const cart = document.querySelector('.cart__list') as HTMLElement;
            cart.appendChild(fragment);

            const order = document.querySelector('.cart__order') as HTMLElement;
            order.append(createOrderBlock(this._cart.cartData));

            if(this.promos.length !== 0) {
                this.calcDiscount();
            }

            const orderParent = document.querySelector('.order__promo-content') as HTMLElement;
            const orderInput = document.querySelector('.order__promo') as HTMLInputElement;
            orderInput.addEventListener('input', (e) => this.findPromo(e, orderParent));

            const applyParent = document.querySelector('.order__apply-promo-box') as HTMLElement;
            this.promos.forEach(el => getApplyPromo(applyParent, el));
            applyParent.addEventListener('click', (e) => this.removePromo(e, applyParent));

            const modal = document.querySelector('.modal') as HTMLElement;
            modal.append(getModal());
        }
    }

    private clickItem(e: Event, data: CartData, parent: HTMLElement) {
        const target = e.target! as HTMLElement;
        if (target.closest('.product-cart__button')) {
            this.removeFromCart(e, data.product, parent);
        } else {
            const titleNum = document.getElementById(`count-${data.product.id}`) as HTMLElement;
            const orderProduct = document.querySelector('.order__count') as HTMLElement;
            const orderPrice = document.querySelector('.order__cost') as HTMLElement;
            const price = document.getElementById(`price-${data.product.id}`) as HTMLElement;
            if(target.closest('.order-num__btn-right')) {
                e.preventDefault();
                data.count++;
                if(data.count > data.product.stock) {
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) + 1}`;
                orderProduct.innerText = `${Number(orderProduct.innerHTML) + 1}`;
                price.innerText = `${data.product.price * data.count}`;
                orderPrice.innerText = `Total: ${this._cart.plusNumber(data)}`;
                this.calcDiscount();
            } else if (target.closest('.order-num__btn-left')) {
                e.preventDefault();
                data.count--;
                if(data.count < 1) {
                    this.removeFromCart(e, data.product, parent);
                    return;
                }
                titleNum.innerText = `${Number(titleNum.innerHTML) - 1}`;
                orderProduct.innerText = `${Number(orderProduct.innerHTML) - 1}`;
                price.innerText = `${data.product.price * data.count}`;
                orderPrice.innerText = `Total: ${this._cart.minusNumber(data)}`;
                this.calcDiscount();
            }
        } 
    }

    private removeFromCart(e: Event, product: Product, parent: HTMLElement) {
        e.preventDefault();
        this._cart.removeFromCart(product);
        if(this._cart.getSize() === 0) {
            localStorage.removeItem('cart-storage');
            parent.innerHTML = this.getEmptyCart();
        } else {
            this.draw();
        }
    }

    private findPromo(e: Event, parent: HTMLElement) {
        const input = (<HTMLTextAreaElement>e.target).value.toUpperCase();
        if(input == PromoCode.RS) {
            this.drawPromo(parent, this.rsPromo);
        } else if(input == PromoCode.EPM) {
            this.drawPromo(parent, this.epmPromo);
        } else {
            parent.innerHTML = '';
        }
    }

    private drawPromo(parent: HTMLElement, promo: Promo) {
        getPromo(parent, promo);
        const addBtn = document.querySelector('.order__promo-btn') as HTMLInputElement;
        if(!this.promos.find(el => el.id == promo.id)) {
            addBtn.classList.remove('hidden');
            addBtn.addEventListener('click', () => {
                this.promos.push(promo);
                localStorage.setItem('promo', JSON.stringify(this.promos));
                this.draw();
            });
        } else {
            addBtn.classList.add('hidden');
        }
    }

    private removePromo(e: Event, parent: HTMLElement) {
        const target = e.target as HTMLElement;
        if(target.closest('button')) {
            const promoName = `${target.id.split('-')[1]}`;
            const id = `promo-${promoName}`;
            const child = document.getElementById(id) as HTMLElement;
            this.promos = this.promos.filter(el => el.id !== promoName.toUpperCase());
            localStorage.setItem('promo', JSON.stringify(this.promos));
            parent.removeChild(child);
            this.draw();
        }
    }

    private calcDiscount() {
        const promoCostTitle = document.querySelector('.order__promo-cost-title') as HTMLElement;
        const promoCost = document.querySelector('.order__promo-cost') as HTMLElement;
        const orderPrice = document.querySelector('.order__cost') as HTMLElement;
        const total = document.getElementById('total') as HTMLElement;
        if(this.promos.length !== 0) {
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

}