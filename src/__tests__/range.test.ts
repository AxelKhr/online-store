import { filterRange, RangeParams } from "../components/model/filterRange";
import { product1, product2, product3 } from './cartUtil.test';

const params = new RangeParams('price');
const data = [product1, product2, product3];

test('isRangeExist', () => {
    expect(params).not.toBeNull();
    expect(params.propertyName).not.toBeNull();
    expect(params.propertyName).toBe('price');
});

test('rangeTest', async () => {
    params.currMin = 50;
    params.currMax = 100;
    expect(await filterRange(data, params)).toStrictEqual([product1, product3]);
});