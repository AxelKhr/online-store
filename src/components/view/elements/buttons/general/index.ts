import "./style.scss";

export default function createButtonGeneral(...classNames: string[]): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('button-general');
  if (classNames) {
    button.classList.add(...classNames);
  }
  return button;
};
