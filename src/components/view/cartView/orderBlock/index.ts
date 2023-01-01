import { PromoCode } from "../../../enum/promo";
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

  const promo = document.createElement('div');
  promo.classList.add('order__promo-block');

  const promoContent = document.createElement('div');
  promoContent.classList.add('order__promo-content');
  
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
  promo.append(input, promoContent);
  box.append(info, promo, btn);
  block.append(title, box);
  return block;
}

function payOrder() {
    const modal = document.querySelector('.modal');
    const modalShadow = document.querySelector('.modal__shadow');
    modal?.classList.remove('hidden');
    modalShadow?.classList.remove('hidden');
}

export function getPromo(parent: HTMLElement, content: string) {
  const promoTitle = document.createElement('p');
  promoTitle.classList.add('order__promo-title');
  promoTitle.innerText = `${content}`;

  const promoBtn = document.createElement('button');
  promoBtn.classList.add('order__promo-btn');
  promoBtn.innerText = 'ADD';

  parent.append(promoTitle, promoBtn);
}