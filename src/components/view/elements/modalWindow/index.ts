import "./style.scss";

let windowStylePosition = '';

function create(nameClass: string): HTMLDivElement {
  const windowModal = document.createElement('div');
  windowModal.classList.add(nameClass, 'window', 'window-hidden');
  windowModal.addEventListener('click', () => {
    windowModal.classList.add('window-hidden');
    document.body.style.position = windowStylePosition;
    const top = document.body.style.top;
    document.body.style.top = '';
    window.scrollTo(0, -parseInt(top));
  });
  const container = document.createElement('div');
  container.classList.add('window__container');
  windowModal.append(container);
  return windowModal;
}

function show(nameClass: string, content: HTMLDivElement): void {
  const windowModal = document.querySelector(`.${nameClass}`) as HTMLDivElement;
  const container = document.querySelector(`.${nameClass} .window__container`) as HTMLDivElement;
  container.innerHTML = '';
  container.append(content.cloneNode(true) as HTMLDivElement);
  windowModal.classList.remove('window-hidden');
  windowStylePosition = document.body.style.position;
  const top = -window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `${top}px`;
}

export { create, show };