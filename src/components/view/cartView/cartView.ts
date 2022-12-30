import "./style.scss";
import { AbstractView } from "../abstractView";
import * as CartItem from "./cartItem";
import { Product } from "../../interface/product";
import { createOrderBlock } from "./orderBlock";
import { getModal } from "./modal";
import { Cart } from "./cart/cart";

export class CartView extends AbstractView {

    private _cart: Cart;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
    }
    
    async getView(): Promise<HTMLElement>  {
        let content = document.createElement('section') as HTMLElement;
        content.classList.add('cart-page');
        content.innerHTML = this.getEmptyCart();
        return content;
    }

    draw(): void {
        const parent = document.querySelector('.cart-page') as HTMLElement;
        const data: string[] = JSON.parse(localStorage.getItem('cart-items')!);
        if (data !== null) {
            const fragment = document.createDocumentFragment();
            const cardTemp = CartItem.createTemplate();
            const arr: Product[] = [];

            data.forEach(item => {
                const product: Product = JSON.parse(item);
                const card = cardTemp.cloneNode(true) as HTMLElement;
                card.classList.add('products__card');
                CartItem.setData(card, product);
                fragment.append(card);
                arr.push(product);
                card.addEventListener('click', (e: Event) => this.clickItem(e, product, parent));
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
            order.append(createOrderBlock(arr));

            const modal = document.querySelector('.modal') as HTMLElement;
            modal.append(getModal());
        }
    }

    clickItem(e: Event, product: Product, parent: HTMLElement) {
        const target = e.target! as HTMLElement;
        if (target.closest('.product-cart__button')) {
            this.removeFromCart(e, product, parent);
        } else if(target.closest('.order-num__btn-right')) {
            e.preventDefault();
            const titleNum = document.getElementById(`count-${product.id}`) as HTMLElement;
            const orderProduct = document.querySelector('.order__count') as HTMLElement;
            let title = Number(titleNum.innerHTML) + 1;
            titleNum.innerText = `${title}`;
            let orderTitle = Number(orderProduct.innerHTML) + 1;
            orderProduct.innerText = `${orderTitle}`;
            this._cart.plusNumber(product, titleNum);
        } else if(target.closest('.order-num__btn-left')) {
            e.preventDefault();
            const titleNum = document.getElementById(`count-${product.id}`) as HTMLElement;
            const orderProduct = document.querySelector('.order__count') as HTMLElement;
            let title = Number(titleNum.innerHTML) - 1;
            titleNum.innerText = `${title}`;
            let orderTitle = Number(orderProduct.innerHTML) - 1;
            orderProduct.innerText = `${orderTitle}`;
            this._cart.minusNumber(product, titleNum);
        }
    }

    removeFromCart(e: Event, product: Product, parent: HTMLElement) {
        e.preventDefault();
        this._cart.removeFromCart(product);
        if(this._cart.getSize() === 0) {
            localStorage.removeItem('cart-items');
            parent.innerHTML = this.getEmptyCart();
        } else {
            this.draw();
        }
    }

    getEmptyCart() {
        return `<div class="cart-message">
                    <span class="cart__text">Your cart is empty</span>
                    <a href="#" class="cart__btn">Go shopping</a>
                </div>`;
    }

}