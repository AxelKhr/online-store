import { Product } from "../../../interface/product";

export class Cart {

    private cartItems: Set<string>;
    private cart: HTMLElement;
    private totalSum: HTMLElement; 

    constructor() {
        const data = JSON.parse(localStorage.getItem('cart-items')!);
        (data !== null) ? this.cartItems = new Set<string>(Array.from(data)) : this.cartItems = new Set<string>();
        this.cart = document.querySelector('.indicator__span') as HTMLElement;
        this.totalSum = document.querySelector('#total') as HTMLElement;
        this.cart.innerText = `${this.cartItems.size}`;
        this.totalSum.innerText! = this.getTotalSum();
    }

    getTotalSum() {
        let sum = 0;
        this.cartItems.forEach(el => {
            sum += JSON.parse(el).price;
        });
        return `${sum}`;
    }

    addToCart(item: Product): void {
        const itemStr = JSON.stringify(item);
        const cartSize = this.cartItems.size;
        this.cartItems.add(itemStr);
        if(cartSize !== this.cartItems.size) {
            localStorage.setItem('cart-items', JSON.stringify(Array.from(this.cartItems)));
            this.cart.innerText! = `${this.cartItems.size}`;
            let sum = Number(this.totalSum.innerText);
            sum += item.price;
            this.totalSum.innerText! = `${sum}`;
        }
    }

}