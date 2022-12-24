import { Product } from "../interface/product";

export class ProductModel {

    private products: Product[] = [];

    setProducts(products: Product[]) {
        this.products = products;
    }

    getProducts() {
        return this.products;
    }

    getCategories() {
        const categories = new Set<string>();
        this.products.forEach((el) => categories.add(el.category));
        return categories;
    }

    getBrands() {
        const brands = new Set<string>();
        this.products.forEach((el) => brands.add(el.brand));
        return brands;
    }
}