import { AbstractView } from "../view/abstractView";

export interface Route {
    pathReg: string;
    title: string;
    component: AbstractView;
}