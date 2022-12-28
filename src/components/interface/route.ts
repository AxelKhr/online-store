import { AbstractView } from "../view/abstractView";

export interface Route {
    path: string;
    title: string;
    loader: (param: string) => void;
}