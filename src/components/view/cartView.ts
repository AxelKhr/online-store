import { AbstractView } from "./abstractView";

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
}