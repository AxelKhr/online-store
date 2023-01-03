import { Product } from "../interface/product";

export class RangeParams {
    private readonly _propertyName: string;
    step: number;
    minEn: boolean;
    maxEn: boolean;
    rangeMin: number;
    rangeMax: number;
    currMin: number;
    currMax: number;
    srcMin: number;
    srcMax: number;

    constructor(property: string) {
        this._propertyName = property;
        this.step = 1;
        this.minEn = false;
        this.maxEn = false;
        this.rangeMin = 0;
        this.rangeMax = 1;
        this.currMin = 0;
        this.currMax = 1;
        this.srcMin = 0;
        this.srcMax = 1;

    }

    get propertyName() {
        return this._propertyName;
    }
}

export async function setRange(data: Product[], params: RangeParams): Promise<Product[]> {
    return new Promise(function (resolve) {
        if (data.length > 0) {
            const rangePriceMin =
                Math.min(...data.map((item) => item[params.propertyName as keyof Product] as number));
            if (params.minEn) {
                params.rangeMin = Math.min(rangePriceMin, params.currMin);
            } else {
                params.rangeMin = rangePriceMin;
                params.currMin = rangePriceMin;
            }
            const rangePriceMax =
                Math.max(...data.map((item) => item[params.propertyName as keyof Product] as number));
            if (params.maxEn) {
                params.rangeMax =
                    Math.max(rangePriceMax, params.currMax);
            } else {
                params.rangeMax = rangePriceMax;
                params.currMax = rangePriceMax;
            }
        }
        resolve(data);
    });
}

export async function filterRange(data: Product[], params: RangeParams): Promise<Product[]> {
    return new Promise(function (resolve) {
        if (data.length > 0) {
            const dataOut: Product[] = [];
            data.forEach((item) => {
                if (
                    ((item[params.propertyName as keyof Product] as number) >= params.currMin) &&
                    ((item[params.propertyName as keyof Product] as number) <= params.currMax)
                ) {
                    dataOut.push(item);
                }
            });
            resolve(dataOut);
        }
        resolve(data);
    });
}
