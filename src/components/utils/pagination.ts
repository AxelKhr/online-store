import { CartData } from "../view/cartView/cart/cart";

export class PaginationHelper {

    private collection: CartData[];
    private itemsPerPage: number;

    constructor(collection: CartData[], itemsPerPage: number) {
        this.collection = collection;
        this.itemsPerPage = itemsPerPage;
    }

    itemCount() {
        return this.collection.length;
    }

    pageCount() {
        return Math.ceil(this.itemCount() / this.itemsPerPage);
    }

    pageItemCount(pageIndex: number) {
        if(pageIndex < 0 || pageIndex > this.pageCount() - 1) {
            return -1;
          }
        return this.itemsPerPage - Math.ceil((((pageIndex + 1) * this.itemsPerPage) % this.itemCount()) % this.itemsPerPage);
    }

    pageIndex(itemIndex: number) {
        if(itemIndex < 0 || itemIndex > this.itemCount() - 1) {
            return -1;
        }
        return Math.ceil((itemIndex + 1) / this.itemsPerPage) - 1;
    }
}