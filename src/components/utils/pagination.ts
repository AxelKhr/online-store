import { CartData } from "../view/cartView/cart/cart";

export class PaginationHelper {

    private collection: CartData[];
    private itemsPerPage: number;

    constructor(collection: CartData[], itemsPerPage: number) {
        this.collection = collection;
        this.itemsPerPage = itemsPerPage;
    }

    // returns the number of items within the entire collection
    itemCount() {
        return this.collection.length;
    }

    // returns the number of pages
    pageCount() {
        return Math.ceil(this.itemCount() / this.itemsPerPage);
    }

    // returns the number of items on the current page. page_index is zero based.
    // this method should return -1 for pageIndex values that are out of range
    pageItemCount(pageIndex: number) {
        if(pageIndex < 0 || pageIndex > this.pageCount() - 1) {
            return -1;
          }
        return this.itemsPerPage - Math.ceil((((pageIndex + 1) * this.itemsPerPage) % this.itemCount()) % this.itemsPerPage);
    }

    // determines what page an item is on. Zero based indexes
    // this method should return -1 for itemIndex values that are out of range
    pageIndex(itemIndex: number) {
        if(itemIndex < 0 || itemIndex > this.itemCount() - 1) {
            return -1;
        }
        return Math.ceil((itemIndex + 1) / this.itemsPerPage) - 1;
    }
}