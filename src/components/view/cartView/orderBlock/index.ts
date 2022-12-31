import { Product } from "../../../interface/product";
import { CartData } from "../cart/cart";
import "./style.scss";

export function createOrderBlock(data: CartData[]): HTMLElement {
  const block = document.createElement('div');
  block.classList.add('order', 'order__block');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const title = document.createElement('div');
  title.classList.add('order__title');
  title.innerText = "Order"

  const box = document.createElement('div');
  box.classList.add('order__content');

  const info = document.createElement('div');
  info.classList.add('order__info');

  const productsTitle = document.createElement('p');
  productsTitle.classList.add('order__product');
  productsTitle.innerText = `Products: `;
  
  const productsCount = document.createElement('span');
  productsCount.classList.add('order__count');
  productsCount.innerText = `${data.reduce((count, acc) => count + acc.count, 0)}`;

  const cost = document.createElement('p');
  cost.classList.add('order__cost');
  const total = document.getElementById('total') as HTMLElement;
  cost.innerText = `Total: ${total.innerText}`;

  const input = document.createElement('input');
  input.classList.add('order__promo');
  input.type = 'text';
  input.placeholder = 'Promo code'

  const btn = document.createElement('button');
  btn.classList.add('order__btn');
  btn.innerText = 'PAY';
  btn.addEventListener('click', payOrder);

  productsTitle.append(productsCount);
  info.append(productsTitle, cost);
  box.append(info, input, btn);
  block.append(title, box);
  return block;
}

function payOrder() {
    const modal = document.querySelector('.modal');
    const modalShadow = document.querySelector('.modal__shadow');
    modal?.classList.remove('hidden');
    modalShadow?.classList.remove('hidden');
}