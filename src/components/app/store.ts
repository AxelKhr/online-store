import { AppController } from "../controller/controller";
import { Product } from "../interface/product";

class Store {

    private controller: AppController;

    constructor() {
        this.controller = new AppController();
    }

    init() {
        this.controller.loadData(async (data) => {
            await this.controller.init(data.products)
                .then(this.controller.handleLocation);
        });
        window.addEventListener("hashchange", this.controller.handleLocation);
    }

}

export default Store;