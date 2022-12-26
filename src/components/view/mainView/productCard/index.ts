import "./style.scss";
import { Product } from "../../../interface/product";

function createTemplate(): HTMLElement {
  const card = document.createElement('a');
  card.setAttribute('href', '#');
  card.classList.add('product-card');

  const box = document.createElement('div');
  box.classList.add('product-card__box');

  const image = document.createElement('div');
  image.classList.add('product-card__thumbnail');

  const detailing = document.createElement('div');
  detailing.classList.add('product-card__detailing');

  const title = document.createElement('p');
  title.classList.add('product-card__title');

  const brand = document.createElement('p');
  brand.classList.add('product-card__brand');

  const buy = document.createElement('div');
  buy.classList.add('product-card__buy');

  const price = document.createElement('div');
  price.classList.add('product-card__price');

  const button = document.createElement('button');
  button.classList.add('product-card__button');
  button.textContent = 'ADD';

  buy.append(price, button);

  detailing.append(title, brand, buy);

  const discount = document.createElement('div');
  discount.classList.add('product-card__discount');

  box.append(discount, image, detailing);
  card.append(box);

  return card;
}

function setData(card: HTMLElement, data: Product): void {
  card.setAttribute('href', `#/product/?id=${data.id}`);
  (card.querySelector('.product-card__thumbnail') as HTMLElement).style.backgroundImage =
    `url(${data.thumbnail})`;
  (card.querySelector('.product-card__title') as HTMLElement).textContent = data.title;
  (card.querySelector('.product-card__brand') as HTMLElement).textContent = data.brand;
  (card.querySelector('.product-card__price') as HTMLElement).textContent = `${data.price}`;
  const discount = (card.querySelector('.product-card__discount') as HTMLElement);
  if (data.discountPercentage > 0) {
    discount.classList.remove('block--hidden');
    discount.textContent = `${data.discountPercentage}` + '%';
  } else {
    discount.classList.add('block--hidden');
  }
}

export { createTemplate, setData };