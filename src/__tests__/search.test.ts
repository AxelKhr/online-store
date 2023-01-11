import { filterSearch, SearchParams } from "../components/model/filterSearch";
import { product1, product2, product3 } from './cartUtil.test';

const param = new SearchParams();
const data = [product1, product2, product3];

test('isSearchExist', () => {
    expect(param).not.toBeNull();
    expect(param.value).not.toBeNull();
    expect(param.type).not.toBeNull();
    expect(param.enable).not.toBeNull();
    expect(param.enable).toBeFalsy();
});

test('searchByBrand', async () => {
    param.type = 'brand';
    param.value = 'huawei';
    param.enable = true;
    expect(await filterSearch(data, param)).toStrictEqual([product2]);
});

test('searchByCategory', async () => {
    param.type = 'category';
    param.value = 'tv';
    param.enable = true;
    expect(await filterSearch(data, param)).toStrictEqual([product3]);
});

test('allProductWhenSearchDisabled', async () => {
    param.type = 'brand';
    param.value = 'huawei';
    param.enable = false;
    expect(await filterSearch(data, param)).toStrictEqual(data);
});
