import { AppController } from "../controller/controller";
import { Product } from "../interface/product";
import Router from "../utils/router";

class Store {

    private router: Router;
    private controller: AppController;

    constructor() {
        this.router = new Router();
        this.controller = new AppController();
    }

    init() {
        this.drawView();
        window.addEventListener("hashchange", this.drawView);
    }

    drawView = () => {
        this.controller.getProducts((data) => this.router.locationHandler().then((view) => {
            if(data.products !== undefined) {
                view?.draw(data.products);
            } else {
                view?.draw(data);
            }
        }));
    }

}

export default Store;