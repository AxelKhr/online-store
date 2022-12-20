import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";

export class ProductView extends AbstractView {

    async getView(): Promise<HTMLElement> {
        const content = document.createElement('section') as HTMLElement;
        content.classList.add('content__product-page', 'product-page');
        const path = document.createElement('div');
        path.classList.add('product-page__path');
        const box = document.createElement('div');
        box.classList.add('product-page__box');
        const view = document.createElement('div');
        view.classList.add('product-page__view');
        const control = document.createElement('div');
        control.classList.add('product-page__control');
        box.append(view, control);
        const detailing = document.createElement('div');
        detailing.classList.add('product-page__detailing');
        content.append(path, box, detailing);
        return content;
    }

    drawView(data: Product) {

        const createElemP = (classNames: string[], textContent?: string): HTMLParagraphElement => {
            const par = document.createElement('p');
            par.classList.add(...classNames);
            if (textContent) {
                par.textContent = textContent;
            }
            return par;
        }

        const path = document.querySelector('.product-page__path') as HTMLElement;
        path.textContent = 'Path';

        const view = document.querySelector('.product-page__view') as HTMLElement;

        const image = document.createElement('div');
        image.classList.add('view__image');
        image.style.backgroundImage = `url(${data.images[0]})`;
        view.append(image);

        const control = document.querySelector('.product-page__control') as HTMLElement;

        const buttonAdd = document.createElement('button');
        buttonAdd.classList.add('control__button-add');
        buttonAdd.textContent = 'ADD';
        const buttonBuy = document.createElement('button');
        buttonBuy.classList.add('control__button-buy');
        buttonBuy.textContent = 'BUY';

        control.append(
            createElemP(['control__title'], data.title),
            createElemP(['control__brand'], data.brand),
            createElemP(['control__rating'], `Rating: ${data.rating}`),
            createElemP(['control__discount'], `Discount: ${data.discountPercentage}%`),
            createElemP(['control__stock'], `Stock: ${data.stock}`),
            createElemP(['control__price'], `Price: ${data.price}`),
            buttonAdd, buttonBuy);

        const detailing = document.querySelector('.product-page__detailing') as HTMLElement;
        detailing.append(
            createElemP(['detailing__title'], 'Detailing'),
            createElemP(['detailing__item'], `Category: ${data.category}`),
            createElemP(['detailing__item'], `Brand: ${data.brand}`),
            createElemP(['detailing__item'], `Description: ${data.description}`)
        );
    }
}