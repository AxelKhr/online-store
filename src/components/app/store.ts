import { AppController } from "../controller/controller";
import Router from "../utils/router";

class Store {

    private router: Router;
    private controller: AppController;

    constructor() {
        this.router = new Router();
        this.controller = new AppController();
    }

    init(): void {
        this.drawView();
        window.addEventListener("hashchange", this.drawView);
    }

    drawView = () => {
        this.controller.getProduct((data) => this.router.locationHandler().then((view) => view?.draw(data.products)));
    }
}

export default Store;