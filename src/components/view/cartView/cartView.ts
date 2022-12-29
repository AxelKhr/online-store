import "./style.scss";
import { AbstractView } from "../abstractView";
import * as CartItem from "./cartItem";
import { Product } from "../../interface/product";
import { createOrderBlock } from "./orderBlock";
import { getModal } from "./modal";

export class CartView extends AbstractView {

    async getView(): Promise<HTMLElement> {
        let content = document.createElement('section') as HTMLElement;
        content.classList.add('cart-page');
        content.innerHTML = `
        <div class="cart-message">
            <span class="cart-text">Your cart is empty</span>
            <a href="#" class="cart-btn">Go shopping</a>
        </div>`;
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

}