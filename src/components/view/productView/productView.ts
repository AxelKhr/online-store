import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import createButtonGeneral from "../elements/buttons/general";
import SliderSingle from "../elements/sliderSingle";
import * as tableTwoCols from "../elements/tableTwoCols";
import * as ModalWindow from "../elements/modalWindow";
import { Cart } from "../cartView/cart/cart";
import { ModelProductState } from "../../model/modelProduct";

export class ProductView extends AbstractView {

    private cart: Cart;

    constructor(cart: Cart) {
        super();
        this.cart = cart;
    }

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
        const modalWindow = ModalWindow.create('product-page__modal-image');
        content.append(path, box, detailing);
        document.body.append(modalWindow);
        return content;
    }

    draw(data: ModelProductState) {
        if (data.product) {
            const createElemP = (textContent: string, classNames?: string[]): HTMLParagraphElement => {
                const par = document.createElement('p');
                if (classNames) {
                    par.classList.add(...classNames);
                }
                par.textContent = textContent;
                return par;
            }

            const path = document.querySelector('.product-page__path') as HTMLElement;
            path.textContent = `Store >> ${data.product.category} >> ${data.product.brand} >> ${data.product.title}`.toUpperCase();

            const view = document.querySelector('.product-page__view') as HTMLElement;
            const sliderContainer = document.createElement('div');
            sliderContainer.classList.add('view__slider-container');
            view.append(sliderContainer);
            const sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('view__slider-wrapper');
            const slider = new SliderSingle();
            slider.content.classList.add('view__slider');
            const altText = data.product.title;
            data.product.images.forEach((item) => {
                const box = document.createElement('div');
                box.classList.add('view__image');
                const imageWrapper = document.createElement('div');
                const image = document.createElement('img');
                image.src = item;
                image.alt = altText;
                imageWrapper.append(image);
                box.append(imageWrapper);
                slider.addItem(box);
            });
            sliderContainer.addEventListener('click', (event) => {
                ModalWindow.show('product-page__modal-image', slider.getCurrentItem() as HTMLDivElement);
            });
            sliderWrapper.append(slider.content);
            const buttonsBlock = document.createElement('div');
            buttonsBlock.classList.add('slider__buttons');
            const buttonLeft = document.createElement('button');
            buttonLeft.textContent = '<';
            buttonLeft.addEventListener('click', (event) => {
                event.stopPropagation();
                slider.moveToPrev();
            });
            const buttonRight = document.createElement('button');
            buttonRight.textContent = '>';
            buttonRight.addEventListener('click', (event) => {
                event.stopPropagation();
                slider.moveToNext()
            });
            buttonsBlock.append(buttonLeft, buttonRight);
            sliderContainer.append(sliderWrapper, buttonsBlock);

            const control = document.querySelector('.product-page__control') as HTMLElement;
            const buttonAdd = createButtonGeneral('control__button-add');
            buttonAdd.textContent = 'ADD';
            buttonAdd.addEventListener('click', () => this.cart.addToCart(data.product!));
            const buttonBuy = createButtonGeneral('control__button-buy');
            buttonBuy.textContent = 'BUY';
            control.append(
                createElemP(data.product.title, ['control__title']),
                createElemP(data.product.brand, ['control__brand']),
                createElemP(`Rating: ${data.product.rating}`, ['control__rating']),
                createElemP(`Discount: ${data.product.discountPercentage}%`, ['control__discount']),
                createElemP(`Stock: ${data.product.stock}`, ['control__stock']),
                createElemP(`Price: ${data.product.price}`, ['control__price']),
                buttonAdd, buttonBuy);

            const detailing = document.querySelector('.product-page__detailing') as HTMLElement;
            const table = tableTwoCols.createTable();
            table.classList.add('detailing__table');
            tableTwoCols.addRow(table, 'Category', `${data.product.category}`)
            tableTwoCols.addRow(table, 'Brand', `${data.product.brand}`)
            tableTwoCols.addRow(table, 'Description', `${data.product.description}`)
            detailing.append(
                createElemP('Detailing', ['detailing__title']),
                table
            );
        }
    }
}