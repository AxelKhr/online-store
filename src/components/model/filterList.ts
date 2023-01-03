import { Product } from "../interface/product";

export class ListItemParam {
    name: string;
    count: number;
    total: number;
    checked: boolean;

    constructor(name: string, count: number, total: number, checked: boolean) {
        this.name = name;
        this.count = count;
        this.total = total;
        this.checked = checked;
    }
}

export class ListParams extends Map<string, ListItemParam> {
    private readonly _propertyName: string;

    constructor(property: string) {
        super();
        this._propertyName = property;
    }

    get propertyName() {
        return this._propertyName;
    }

    getCheckedNames() {
        const names: string[] = [];
        this.forEach((item) => {
            if (item.checked) { names.push(item.name) }
        });
        return names;
    }
}

export async function filterList(data: Product[], params: ListParams): Promise<Product[]> {
    return new Promise(function (resolve) {
        const namesChecked = params.getCheckedNames();
        if ((data.length > 0) && (namesChecked.length > 0)) {
            const dataOut: Product[] = [];
            data.forEach((item) => {
                if (namesChecked.includes(item[params.propertyName as keyof Product] as string)) {
                    dataOut.push(item);
                }
            });
            resolve(dataOut);
        }
        resolve(data);
    });
}
