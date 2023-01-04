import { CartData } from "../cart/cart";
import { Promo } from "../cartView";
import { ModalView } from "../modalView";
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

  const promoCostBlock = document.createElement('p');
  promoCostBlock.classList.add('order__promo-cost-title', 'transparent');
  promoCostBlock.innerText = 'Total: ';
  const promoCost = document.createElement('span');
  promoCost.classList.add('order__promo-cost');
  promoCost.innerText = `${total.innerText}`;
  promoCostBlock.append(promoCost);

  const promo = document.createElement('div');
  promo.classList.add('order__promo-block');

  const applyPromo = document.createElement('div');
  applyPromo.classList.add('order__apply-promo-box');

  const promoContent = document.createElement('div');
  promoContent.classList.add('order__promo-content');
  
  const input = document.createElement('input');
  input.classList.add('order__promo');
  input.type = 'text';
  input.placeholder = 'test promo: "RS", "EPM"';

  const btn = document.createElement('button');
  btn.classList.add('order__btn');
  btn.innerText = 'PAY';
  btn.addEventListener('click', payOrder);

  productsTitle.append(productsCount);
  info.append(productsTitle, cost, promoCostBlock);
  promo.append(input, promoContent);
  box.append(info, applyPromo, promo, btn);
  block.append(title, box);
  return block;
}

function payOrder() {
    const modal = document.querySelector('.modal');
    const modalShadow = document.querySelector('.modal__shadow');
    modal?.classList.remove('hidden');
    modalShadow?.classList.remove('hidden');
    new ModalView().getView();
}

export function getPromo(parent: HTMLElement, promo: Promo) {
  const promoTitle = document.createElement('p');
  promoTitle.classList.add('order__promo-title');
  promoTitle.innerText = `${promo.name}`;

  const promoBtn = document.createElement('button');
  promoBtn.classList.add('order__promo-btn', 'hidden');
  promoBtn.innerText = 'ADD';

  parent.append(promoTitle, promoBtn);
}

export function getApplyPromo(parent: HTMLElement, promo: Promo) {
  const applyBox = document.createElement('div');
  applyBox.classList.add('order__apply-promo');
  applyBox.id = `promo-${promo.id.toLowerCase()}`;

  const promoTitle = document.createElement('p');
  promoTitle.classList.add('order__promo-title');
  promoTitle.innerText = `${promo.name}`;

  const promoBtn = document.createElement('button');
  promoBtn.classList.add('order__apply-promo-btn');
  promoBtn.innerText = 'DROP';
  promoBtn.id = `btn-${promo.id.toLowerCase()}`;

  applyBox.append(promoTitle, promoBtn);
  parent.appendChild(applyBox);
}