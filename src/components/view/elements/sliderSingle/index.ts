import "./style.scss";

export default class SliderSingle {
  content: HTMLElement;
  private _items: HTMLDivElement[];
  private _curItemIndex: number;
  private _isEnable: boolean;

  constructor() {
    this._items = [];
    this._curItemIndex = 0;
    this._isEnable = true;
    this.content = document.createElement('div');
    this.content.classList.add('slider');
  }

  get items() {
    return this._items;
  }

  getCurrentItem(): HTMLDivElement | null {
    if (this._curItemIndex < this._items.length) {
      return this._items[this._curItemIndex];
    }
    return null;
  }

  addItem(item: HTMLDivElement) {
    item.classList.add('slider__item');
    if (this._items.length === 0) {
      item.classList.add('active');
    }
    this.items.push(item);
    this.content.append(item);
  }

  moveToNext() {
    if ((this._isEnable) && (this._curItemIndex < this._items.length - 1)) {
      this.hideItem(this._curItemIndex, 'to-left');
      this._curItemIndex += 1;
      this.showItem(this._curItemIndex, 'from-right');
    }
  }

  moveToPrev() {
    if ((this._isEnable) && (this._curItemIndex > 0)) {
      this.hideItem(this._curItemIndex, 'to-right');
      this._curItemIndex -= 1;
      this.showItem(this._curItemIndex, 'from-left');
    }
  }

  private hideItem(index: number, direction: string) {
    this._isEnable = false;
    this._items[index].classList.add(direction);
    this._items[index].addEventListener('animationend', () => {
      this._items[index].classList.remove('active', direction);
    }, { once: true })
  }

  private showItem(index: number, direction: string) {
    this._items[index].classList.add('next', direction);
    this._items[index].addEventListener('animationend', () => {
      this._items[index].classList.remove('next', direction);
      this._items[index].classList.add('active');
      this._isEnable = true;
    }, { once: true })
  }
}
