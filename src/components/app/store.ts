import { AppController } from "../controller/controller";
import Router from "../utils/router";
import DataModel from "../model/dataModel";
import AppView from "../view/appView";

class Store {

    private router: Router;
    private controller: AppController;
    private dataModel: DataModel;
    private appView: AppView;

    constructor() {
        this.router = new Router();
        this.controller = new AppController();
        this.dataModel = new DataModel();
        this.appView = new AppView(this.controller);

        this.router.addRoute(/product\/\d+/g, 'Product', this.appView.productView);
        this.router.addRoute(/cart/g, 'Cart', this.appView.cartView)
        this.router.addRoute(/\//g, 'Online store', this.appView.homeView);
    }

    init() {
        this.route();
        window.addEventListener("hashchange", this.route);
    }

    route = () => {
        this.router.locationHandler().then((view) => {
            this.controller.getProducts((data) => {
                if (data.products !== undefined) {
                    view?.draw(data.products);
                } else {
                    view?.draw(data);
                }
            })
        })
    }

}

export default Store;