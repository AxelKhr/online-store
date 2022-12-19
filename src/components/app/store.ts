import { AppController } from "../controller/controller";
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
        this.controller.getProducts((data) => this.router.locationHandler()
            .then((view) => view?.draw(data.products))
            .then(() => {
                document.querySelector('.table__list')?.addEventListener('click', (event) => this.drawProduct(event));
        }));
    }

    drawProduct = (e: Event) => {
        this.controller.drawProduct(e, (data) => this.router.locationHandler().then((view) => view?.draw(data.products)));
    }

}

export default Store;