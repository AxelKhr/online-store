import { Product } from "../../../interface/product";

export interface CartStorage {
    product: Product;
    count: number;
    state: boolean;
}

export class Cart {

    private carts: Product[] = [];
    private products: Set<number>;

    private cartProducts!: Product[];

    private cartIcon!: HTMLElement;
    private totalSum!: HTMLElement; 

    constructor() {
        const data = JSON.parse(localStorage.getItem('cart-id')!);
        (data !== null) ? this.products = new Set<number>(Array.from(data)) : this.products = new Set<number>;
    }

    initCartProduct(products: Product[]) {
        this.carts = products;
        this.init();
    }

    private init() {
        if(this.products !== null) {
            this.cartProducts = this.carts.filter(product => Array.from(this.products).some(id => id === product.id));
            this.cartIcon = document.querySelector('.indicator__span') as HTMLElement;
            this.totalSum = document.querySelector('#total') as HTMLElement;
            this.cartIcon.innerText = `${this.cartProducts.length}`;
            this.totalSum.innerText! = this.getTotalSum();
        }
    }

    getSize(): number {
        return this.products.size;
    }

    getTotalSum() {
        let sum = 0;
        this.cartProducts.forEach(el => {
            sum += el.price;
        });
        return `${sum}`;
    }

    addToCart(item: Product): void {
        const cartSize = this.products.size;
        this.products.add(item.id);
        if(cartSize !== this.products.size) {
            localStorage.setItem('cart-id', JSON.stringify(Array.from(this.products)));
            this.cartIcon.innerText! = `${this.products.size}`;
            let sum = Number(this.totalSum.innerText);
            sum += item.price;
            this.totalSum.innerText! = `${sum}`;
        }
    }

    removeFromCart(item: Product): void {
        const itemStr = JSON.stringify(item);
        const cartSize = this.products.size;
        //this.products.delete(itemStr);
        if(cartSize !== this.products.size) {
            localStorage.removeItem('cart-items');
            localStorage.setItem('cart-items', JSON.stringify(Array.from(this.products)));
            //this.cart.innerText! = `${this.cartItems.size}`;
            let sum = Number(this.totalSum.innerText);
            sum -= item.price;
            this.totalSum.innerText! = `${sum}`;
        }
    }

    plusNumber(item: Product, titleNum: HTMLElement): void {
        //let count = Number(this.cart.innerText) + 1;
        //this.cart.innerText = `${count}`;
        let sum = Number(this.totalSum.innerText);
        console.log(sum);
    }

    minusNumber(item: Product, titleNum: HTMLElement): void {
        //let count = Number(this.cart.innerText) - 1;
        //this.cart.innerText = `${count}`;
        let sum = Number(this.totalSum.innerText);
        console.log(sum);
    }

}