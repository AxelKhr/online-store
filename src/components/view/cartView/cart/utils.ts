import { Product } from "../../../interface/product";
import { CartData, CartStorage } from "./cart";

export function getTotalSum(data: CartData[]) {
    return data.reduce((sum, acc) => sum + acc.product.price * acc.count, 0);
}

export function getProductCount(data: CartData[]) {
    return data.reduce((sum, acc) => sum + acc.count, 0);
}

export function mapCartData(storage: CartStorage[], products: Product[]): CartData[] {
    return storage.reduce((arr, acc) => {
        const product = products.find(el => el.id === acc.id);
        if (product) {
            arr.push({ product: product, count: acc.count });
        }
        return arr;
    }, new Array<CartData>());
}
