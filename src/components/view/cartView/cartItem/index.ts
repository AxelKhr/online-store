import "./style.scss";
import { Product } from "../../../interface/product";

function createTemplate(): HTMLElement {
  const card = document.createElement('a');
  card.setAttribute('href', '#');
  card.classList.add('product-cart');

  const box = document.createElement('div');
  box.classList.add('product-cart__box');

  const image = document.createElement('div');
  image.classList.add('product-cart__thumbnail');

  const detailing = document.createElement('div');
  detailing.classList.add('product-cart__detailing');

  const title = document.createElement('p');
  title.classList.add('product-cart__title');

  const brand = document.createElement('p');
  brand.classList.add('product-cart__brand');

  const description = document.createElement('p');
  description.classList.add('product-cart__desc');

  const buy = document.createElement('div');
  buy.classList.add('product-cart__buy');

  const price = document.createElement('div');
  price.classList.add('product-cart__price');

  const button = document.createElement('button');
  button.classList.add('product-cart__button');
  button.textContent = 'REMOVE';

  buy.append(price, button);

  detailing.append(title, brand, description);



  box.append(image, detailing, buy);
  card.append(box);

  return card;
}

function setData(card: HTMLElement, data: Product): void {
  card.setAttribute('href', `#product/?id=${data.id}`);
  (card.querySelector('.product-cart__thumbnail') as HTMLElement).style.backgroundImage =
    `url(${data.thumbnail})`;
  (card.querySelector('.product-cart__title') as HTMLElement).textContent = data.title;
  (card.querySelector('.product-cart__brand') as HTMLElement).textContent = data.brand;
  (card.querySelector('.product-cart__desc') as HTMLElement).textContent = `${data.description}`;
  (card.querySelector('.product-cart__price') as HTMLElement).textContent = `${data.price}`;
}

export { createTemplate, setData };