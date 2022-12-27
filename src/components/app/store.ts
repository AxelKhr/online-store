import { AppController } from "../controller/controller";
import { DataModel } from "../model/dataModel";

class Store {

    private controller: AppController;
    private dataModel: DataModel;

    constructor() {
        this.controller = new AppController();
        this.dataModel = new DataModel();
    }

    init() {
        this.controller.handleLocation();
        window.addEventListener("hashchange", () => this.controller.handleLocation());
    }
}

export default Store;