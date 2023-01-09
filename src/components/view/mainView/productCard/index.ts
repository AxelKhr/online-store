import "./style.scss";
import { Product } from "../../../interface/product";
import { createButtonIcon2State, setStateButtonIcon2 } from "../../elements/buttons/icon2state";

function createTemplate(): HTMLElement {
    const card = document.createElement('a');
    card.setAttribute('href', '#');
    card.classList.add('product-card');

    const box = document.createElement('div');
    box.classList.add('product-card__box');

    const image = document.createElement('div');
    image.classList.add('product-card__thumbnail');

    const wrapper = document.createElement('div');
    wrapper.classList.add('product-card__detailing-wrapper')
    const detailing = document.createElement('div');
    detailing.classList.add('product-card__detailing');
    const title = document.createElement('p');
    title.classList.add('product-card__title');
    const brand = document.createElement('p');
    brand.classList.add('product-card__brand');
    const rating = document.createElement('p');
    rating.classList.add('product-card__rating');
    const stock = document.createElement('p');
    stock.classList.add('product-card__stock');
    const buy = document.createElement('div');
    buy.classList.add('product-card__buy');
    const price = document.createElement('div');
    price.classList.add('product-card__price');
    const button = createButtonIcon2State(
        './assets/img/cart_add.svg',
        './assets/img/cart_remove.svg',
        'product-card__button');
    buy.append(price, button);
    detailing.append(title, brand, rating, stock, buy);
    wrapper.append(detailing);

    const discount = document.createElement('div');
    discount.classList.add('product-card__discount');

    box.append(discount, image, wrapper);
    card.append(box);

    return card;
}

function setData(card: HTMLElement, data: Product, isInCart: boolean): void {
    card.setAttribute('href', `#/product?id=${data.id}`);
    (card.querySelector('.product-card__thumbnail') as HTMLElement).style.backgroundImage =
        `url(${data.thumbnail})`;
    (card.querySelector('.product-card__title') as HTMLElement).textContent = data.title;
    (card.querySelector('.product-card__brand') as HTMLElement).textContent = data.brand;
    (card.querySelector('.product-card__rating') as HTMLElement).textContent = `Rating: ${data.rating}`;
    (card.querySelector('.product-card__stock') as HTMLElement).textContent = `Stock: ${data.stock}`;
    (card.querySelector('.product-card__price') as HTMLElement).textContent = `${data.price}$`;
    setButtonStatus((card.querySelector('.product-card__button') as HTMLElement), isInCart);
    const discount = (card.querySelector('.product-card__discount') as HTMLElement);
    if (data.discountPercentage > 0) {
        discount.classList.remove('block--hidden');
        discount.textContent = `${data.discountPercentage}` + '%';
    } else {
        discount.classList.add('block--hidden');
    }
}

function setButtonStatus(button: HTMLElement, isInCart: boolean) {
    button.dataset.checked = isInCart.toString();
}

export { createTemplate, setData, setButtonStatus };