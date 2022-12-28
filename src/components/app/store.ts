import { AppController } from "../controller/controller";

class Store {

    private controller: AppController;

    constructor() {
        this.controller = new AppController();
    }

    init() {
        this.controller.loadData(async (data) => {
            await this.controller.setProducts(data.products)
                .then(this.controller.handleLocation);
        });
        window.addEventListener("hashchange", this.controller.handleLocation);
    }
}

export default Store;