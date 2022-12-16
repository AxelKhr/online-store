import AppLoader from "../controller/appLoader";
import Router from "../utils/router";

class Store {
    init(): void {
        const router = new Router();
        window.addEventListener("hashchange", router.locationHandler);
        router.locationHandler();
        new AppLoader().load();
        
    }
}

export default Store;