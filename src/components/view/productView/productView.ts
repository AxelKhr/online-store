import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import createButtonGeneral from "../elements/buttons/general";
import SliderSingle from "../elements/sliderSingle";

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

        const createElemP = (textContent: string, classNames?: string[]): HTMLParagraphElement => {
            const par = document.createElement('p');
            if (classNames) {
                par.classList.add(...classNames);
            }
            par.textContent = textContent;
            return par;
        }

        const path = document.querySelector('.product-page__path') as HTMLElement;
        path.textContent = 'Path';

        const view = document.querySelector('.product-page__view') as HTMLElement;

        const slider = new SliderSingle();

        data.images.forEach((item) => {
            const box = document.createElement('div');
            box.classList.add('view__image');
            box.style.backgroundImage = `url(${item})`;
            slider.addItem(box);
        });

        const buttonsBlock = document.createElement('div');
        buttonsBlock.classList.add('slider__buttons');
        const buttonLeft = document.createElement('button');
        buttonLeft.textContent = '<';
        buttonLeft.addEventListener('click', () => slider.moveToPrev());
        const buttonRight = document.createElement('button');
        buttonRight.textContent = '>';
        buttonRight.addEventListener('click', () => slider.moveToNext());
        buttonsBlock.append(buttonLeft, buttonRight);

        view.append(slider.content, buttonsBlock);

        const control = document.querySelector('.product-page__control') as HTMLElement;

        const buttonAdd = createButtonGeneral('control__button-add');
        buttonAdd.textContent = 'ADD';
        const buttonBuy = createButtonGeneral('control__button-buy');
        buttonBuy.textContent = 'BUY';

        control.append(
            createElemP(data.title, ['control__title']),
            createElemP(data.brand, ['control__brand']),
            createElemP(`Rating: ${data.rating}`, ['control__rating']),
            createElemP(`Discount: ${data.discountPercentage}%`, ['control__discount']),
            createElemP(`Stock: ${data.stock}`, ['control__stock']),
            createElemP(`Price: ${data.price}`, ['control__price']),
            buttonAdd, buttonBuy);

        const detailing = document.querySelector('.product-page__detailing') as HTMLElement;
        detailing.append(
            createElemP('Detailing', ['detailing__title']),
            createElemP(`Category: ${data.category}`, ['detailing__item']),
            createElemP(`Brand: ${data.brand}`, ['detailing__item']),
            createElemP(`Description: ${data.description}`, ['detailing__item'])
        );
    }
}