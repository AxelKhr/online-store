import { Product } from "../interface/product";

export class ProductModel {

    private products: Product[] = [];

    setProducts(products: Product[]) {
        this.products = products;
    }

    getProducts(param?: string[]) {
        if(param == undefined) {
            return this.products;
        }
        let result = this.products.filter(product => param.find((el) => product.category.match(new RegExp('^' + el + '$'))));
        console.log(result);
        return result;
    }

    getProductById(id: number) {
        return this.products.filter((el) => el.id == id)[0];
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