import "./style.scss";
import { AbstractView } from "../abstractView";
import { Product } from "../../interface/product";
import createButtonGeneral from "../elements/buttons/general";
import SliderSingle from "../elements/sliderSingle";
import * as tableTwoCols from "../elements/tableTwoCols";
import * as ModalWindow from "../elements/modalWindow";
import { Cart } from "../cartView/cart/cart";
import { ModelProductState } from "../../model/modelProduct";
import { createPathList, addToPathList } from "../pathList";

export class ProductView extends AbstractView {

    private _cart: Cart;
    requestQuickBuy!: (item: Product) => void;

    constructor(cart: Cart) {
        super();
        this._cart = cart;
    }

    async getView(): Promise<HTMLElement> {
        const content = document.createElement('section') as HTMLElement;
        content.dataset.name = 'viewProduct';
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
        const modalForRemove = document.querySelectorAll('.product-page__modal-image');
        modalForRemove.forEach((item) => {
            item.remove();
        })
        const modalWindow = ModalWindow.create('product-page__modal-image');
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
            path.innerHTML = '';
            path.append(createPathList('path__list'));
            addToPathList('path__list', 'Store', '#/');
            addToPathList('path__list', `${data.product.category}`,
                `#/?category=${data.product.category}`);
            addToPathList('path__list', `${data.product.brand}`,
                `#/?brand=${data.product.brand}`);
            addToPathList('path__list', `${data.product.title}`,
                `#/?search-type=title&search=${data.product.title}`);

            const view = document.querySelector('.product-page__view') as HTMLElement;
            view.innerHTML = '';
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
            sliderContainer.addEventListener('click', () => {
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
            control.innerHTML = '';
            const buttonAdd = createButtonGeneral('control__button-add');
            buttonAdd.textContent = 'ADD';
            buttonAdd.addEventListener('click', () => {
                if (data.product) {
                    if (this.checkCart(data.product)) {
                        this._cart.removeFromCart(data.product);
                    } else {
                        this._cart.addToCart(data.product);
                    }
                    this.setAddButtonStatus(this.checkCart(data.product));
                }
            });
            const buttonBuy = createButtonGeneral('control__button-buy');
            buttonBuy.textContent = 'BUY';
            buttonBuy.addEventListener('click', () => {
                if ((this.requestQuickBuy) && (data.product)) {
                    this.requestQuickBuy(data.product);
                }
            });
            control.append(
                createElemP(data.product.title, ['control__title']),
                createElemP(data.product.brand, ['control__brand']),
                createElemP(`Rating: ${data.product.rating}`, ['control__rating']),
                createElemP(`Discount: ${data.product.discountPercentage}%`, ['control__discount']),
                createElemP(`Stock: ${data.product.stock}`, ['control__stock']),
                createElemP(`Price: ${data.product.price}`, ['control__price']),
                buttonAdd, buttonBuy);
            this.setAddButtonStatus(this.checkCart(data.product));

            const detailing = document.querySelector('.product-page__detailing') as HTMLElement;
            detailing.innerHTML = '';
            const table = tableTwoCols.createTable();
            table.classList.add('detailing__table');
            tableTwoCols.addRow(table, 'Category', `${data.product.category}`)
            tableTwoCols.addRow(table, 'Brand', `${data.product.brand}`)
            tableTwoCols.addRow(table, 'Description', `${data.product.description}`)
            detailing.append(
                createElemP('Detailing', ['detailing__title']),
                table
            );
        } else {
            const page = document.querySelector('.product-page') as HTMLElement;
            page.innerHTML = '';
            const message = document.createElement('p');
            message.classList.add('product-page__message');
            message.textContent = 'Product not found';
            page.append(message);
        }
    }

    private checkCart(item: Product) {
        return (this._cart.cartData.findIndex((elem) => elem.product.id === item.id) >= 0);
    }

    private setAddButtonStatus(isInCart: boolean) {
        const button = document.querySelector('.control__button-add') as HTMLElement;
        button.textContent = isInCart ? 'REMOVE' : 'ADD';
    }

}
