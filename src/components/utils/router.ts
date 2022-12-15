import { Route } from "../interface/route";

class Router {

    private readonly routes: Route;

    constructor() {
        this.routes = {
            404: {
                template: "./templates/404.html",
                title: "404",
                description: "Page not found",
            },
            "/": {
                template: "./templates/index.html",
                title: "Online store",
                description: "Home page",
            },
            product: {
                template: "./templates/product.html",
                title: "Product",
                description: "Product page",
            },
            cart: {
                template: "./templates/cart.html",
                title: "Cart",
                description: "Cart page",
            }
        }
    }

    locationHandler = async () => {
        let location: string = window.location.hash.replace("#", "");
        if (location.length == 0) {
            location = "/";
        }
        const route = this.routes[location] || this.routes["404"];
        const html = await fetch(route.template).then((response) => response.text());
    
        document.getElementById("content")!.innerHTML = html;
        document.title = route.title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", route.description);
    };

}

export default Router;