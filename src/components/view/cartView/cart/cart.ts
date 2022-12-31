import { Product } from "../../../interface/product";

export interface CartData {
    product: Product;
    count: number;
}

interface CartStorage {
    id: number;
    count: number;
}

export class Cart {

    private storeProducts: Product[] = [];
    private cartStorage: CartStorage[];
    private idSet: Set<number>;

    private cartProducts!: Product[];
    cartData!: CartData[];

    private cartIcon!: HTMLElement;
    private totalSum!: HTMLElement; 

    constructor() {
        const data = JSON.parse(localStorage.getItem('cart-storage')!);
        if(data !== null) {
            this.cartStorage = Array.from(data);
            this.idSet =  new Set<number>(this.cartStorage.map((product) => product.id));
        } else {
            this.cartStorage = []
            this.idSet = new Set<number>();
        }
    }

    initCartProduct(storeProducts: Product[]) {
        this.storeProducts = storeProducts;
        this.init();
    }

    private init() {
        this.cartIcon = document.querySelector('.indicator__span') as HTMLElement;
        this.totalSum = document.querySelector('#total') as HTMLElement;
        if(this.cartStorage.length !== 0) {
            this.cartProducts = this.storeProducts.filter(product => this.cartStorage.some(storage => storage.id === product.id));
            this.cartData = this.mapCartData();
            this.cartIcon.innerText = `${this.getProductCount(this.cartData)}`;
            this.totalSum.innerText! = `${this.getTotalSum(this.cartData)}`;
        } else {
            this.cartData = [];
        }
    }

    getSize(): number {
        return this.idSet.size;
    }

    addToCart(item: Product): void {
        if(this.getSize() < this.idSet.add(item.id).size) {
            this.cartData.push(({product: item, count: 1}));
            const storage: CartStorage[] = this.cartData.map(({product, count}) => ({id: product.id, count: count}));
            localStorage.setItem('cart-storage', JSON.stringify(Array.from(storage)));
            this.cartIcon.innerText! = `${this.getProductCount(this.cartData)}`;
            this.totalSum.innerText! = `${this.getTotalSum(this.cartData)}`;
        }
    }

    removeFromCart(item: Product): void {
        if(this.idSet.delete(item.id)) {
            this.cartData = this.cartData.filter(el => el.product.id !== item.id);
            const storage: CartStorage[] = this.cartData.map(({product, count}) => ({id: product.id, count: count}));
            localStorage.setItem('cart-storage', JSON.stringify(Array.from(storage))); 
            this.cartIcon.innerText! = `${this.getProductCount(this.cartData)}`;
            this.totalSum.innerText! = `${this.getTotalSum(this.cartData)}`;
        }
    }

    plusNumber(data: CartData): number {
        this.saveData(data);
        this.cartIcon.innerText = `${Number(this.cartIcon.innerText) + 1}`;
        let sum = Number(this.totalSum.innerText) + data.product.price;
        this.totalSum.innerText! = `${sum}`;
        return sum;
    }

    minusNumber(data: CartData): number {
        this.saveData(data);
        this.cartIcon.innerText = `${Number(this.cartIcon.innerText) - 1}`;
        let sum = Number(this.totalSum.innerText) - data.product.price;
        this.totalSum.innerText! = `${sum}`;
        return sum;
    }

    private getTotalSum(data: CartData[]) {
        return data.reduce((sum, acc) => sum + acc.product.price * acc.count, 0);
    }

    private getProductCount(data: CartData[]) {
        return data.reduce((sum, acc) => sum + acc.count, 0);
    }

    private mapCartData(): CartData[] {
        return this.cartStorage.reduce((arr, acc) => {
            arr.push({product: this.cartProducts.find(el => el.id === acc.id)!, count: acc.count});
            return arr;
        }, new Array<CartData>());
    }

    private saveData(data: CartData) {
        this.cartData.find((el) => el.product.id == data.product.id)?.count == data.count;
        const storage: CartStorage[] = this.cartData.map(({product, count}) => ({id: product.id, count: count}));
        localStorage.setItem('cart-storage', JSON.stringify(Array.from(storage)));
    }

}