import "./style.scss";

export type FilterSliderData = {
    rangeMin: number;
    rangeMax: number;
    currMin: number;
    currMax: number;
}

export class FilterDualSlider {
    content: HTMLElement;
    private data: FilterSliderData;
    private rangeMin: HTMLInputElement;
    private rangeMax: HTMLInputElement;
    private rangeFill: HTMLDivElement;
    private labelMin: HTMLLabelElement;
    private labelMax: HTMLLabelElement;
    onChange!: (min: number, max: number) => void | never;

    constructor(step: number) {
        this.data = {
            rangeMin: 0,
            rangeMax: 0,
            currMin: 0,
            currMax: 0
        };
        this.content = document.createElement('div');
        this.content.classList.add('filter__slider');
        const sliderBox = document.createElement('div');
        sliderBox.classList.add('slider__range');
        const sliderContainer = document.createElement('div');
        this.rangeMin = document.createElement('input');
        this.rangeMin.classList.add('range-min');
        this.rangeMin.type = 'range';
        this.rangeMin.step = `${step}`;
        this.rangeMin.addEventListener('input', this.calc);
        this.rangeMin.addEventListener('change', () => {
            if (this.onChange) {
                this.onChange(this.data.currMin, this.data.currMax)
            }
        });
        this.rangeMax = document.createElement('input');
        this.rangeMax.classList.add('range-max');
        this.rangeMax.type = 'range';
        this.rangeMax.step = `${step}`;
        this.rangeMax.addEventListener('input', this.calc);
        this.rangeMax.addEventListener('change', () => {
            if (this.onChange) {
                this.onChange(this.data.currMin, this.data.currMax)
            }
        });
        this.rangeFill = document.createElement('div');
        this.rangeFill.classList.add('range-fill');
        sliderContainer.append(this.rangeMin, this.rangeMax, this.rangeFill);
        sliderBox.append(sliderContainer);
        const labels = document.createElement('div');
        labels.classList.add('slider__labels');
        this.labelMin = document.createElement('label');
        this.labelMin.classList.add('slider__label');
        this.labelMax = document.createElement('label');
        this.labelMax.classList.add('slider__label');
        labels.append(this.labelMin, this.labelMax);
        this.content.append(sliderBox, labels);
    }

    setData(data: FilterSliderData) {
        this.data = data;
        this.rangeMin.min = `${this.data.rangeMin}`;
        this.rangeMin.max = `${this.data.rangeMax}`;
        this.rangeMin.value = `${this.data.currMin}`;
        this.rangeMax.min = `${this.data.rangeMin}`;
        this.rangeMax.max = `${this.data.rangeMax}`;
        this.rangeMax.value = `${this.data.currMax}`;
        this.calc();
    }

    private calc = () => {
        let valueMin = Number(this.rangeMin.value);
        if (valueMin > this.data.currMax) {
            valueMin = this.data.currMax;
        }
        this.data.currMin = valueMin;
        this.rangeMin.value = `${this.data.currMin}`;

        let valueMax = Number(this.rangeMax.value);
        if (valueMax < this.data.currMin) {
            valueMax = this.data.currMin;
        }
        this.data.currMax = valueMax;
        this.rangeMax.value = `${this.data.currMax}`;

        const k = this.rangeMax.offsetWidth / (this.data.rangeMax - this.data.rangeMin);
        this.rangeFill.style.left = `${Math.floor(this.data.currMin * k)}px`;
        this.rangeFill.style.right = `${Math.floor((this.data.rangeMax - this.data.currMax) * k)}px`;
        this.labelMin.textContent = `${this.data.currMin}`;
        this.labelMax.textContent = `${this.data.currMax}`;
    }
}

