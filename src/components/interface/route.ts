import { AbstractView } from "../view/abstractView";

export interface Route {
    path: RegExp;
    title: string;
    component: AbstractView;
}