import { Product } from "../interface/product";

export class SearchParams {
    enable: boolean;
    type: string;
    value: string;

    constructor() {
        this.enable = false;
        this.type = '';
        this.value = '';
    }
}

export async function filterSearch(data: Product[], params: SearchParams): Promise<Product[]> {
    return new Promise(function (resolve) {
        if ((data.length > 0) && params.enable) {
            const dataOut: Product[] = [];
            data.forEach((item) => {
                const compareValue = (item[params.type as keyof Product] as string).toLowerCase();
                if (compareValue.includes(params.value.toLowerCase())) {
                    dataOut.push(item);
                }
            })
            resolve(dataOut);
        }
        resolve(data);
    });
}
