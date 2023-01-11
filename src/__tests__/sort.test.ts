import { sortData, SortingParams } from '../components/model/sorting';
import { product1, product2, product3 } from './cartUtil.test';

const param = new SortingParams();
const products = [product1, product2, product3];

test('getParamList', () => {
    expect(param.list.size).toEqual(6);
    expect(param.list).not.toBeNull();
});

test('getCurrent', () => {
    expect(param.current).toEqual('price-asc');
    expect(param.current).not.toBeNull();
});

test('isEnabled', () => {
    expect(param.enable).toBeFalsy();
});

test('addParam', () => {
    param.add('Test-param', 'Sorting by test param');
    expect(param.list.size).toEqual(7);
    expect(param.list).not.toBeNull();
    expect(param.list.has('Test-param')).toBeTruthy();
});

test('sortPriceAsc', async () => {
    expect(await sortData(products, param)).toEqual([product3, product1, product2]);
});

test('sortPriceDesc', async () => {
    param.current = 'price-desc';
    expect(await sortData(products, param)).toEqual([product2, product1, product3]);
});

test('sortDiscountDesc', async () => {
    param.current = 'discount-desc';
    expect(await sortData(products, param)).toEqual([product2, product3, product1]);
});
