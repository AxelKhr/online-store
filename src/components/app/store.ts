import { AppController } from "../controller/controller";

class Store {

    private controller: AppController;

    constructor() {
        this.controller = new AppController();
    }

    init() {
        this.controller.loadData(async (data) => {
            await this.controller.initProducts(data.products)
                .then(this.drawView);
        });
        window.addEventListener("hashchange", this.drawView);
    }

    drawView = () => {
        this.controller.drawView();

    }

}

export default Store;