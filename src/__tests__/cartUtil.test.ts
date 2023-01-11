import { getProductCount, getTotalSum, mapCartData } from '../components/view/cartView/cart/utils';

export const product1 = {
    id: 1,
    title: 'string',
    description: 'string',
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    brand: 'samsung',
    category: 'smartphone',
    thumbnail: 'string',
    images: [],
    price: 100 
}

export const product2 = {
    id: 2,
    title: 'string',
    description: 'string',
    discountPercentage: 10,
    rating: 0,
    stock: 0,
    brand: 'huawei',
    category: 'laptop',
    thumbnail: 'string',
    images: [],
    price: 150 
}

export const product3 = {
    id: 3,
    title: 'string',
    description: 'string',
    discountPercentage: 5,
    rating: 0,
    stock: 0,
    brand: 'apple',
    category: 'tv',
    thumbnail: 'string',
    images: [],
    price: 70
}

const mappedData = [
    {
        product: product3,
        count: 10
    },
    {
        product: product1,
        count: 1
    },
    {
        product: product2,
        count: 2
    }
];

const data = [{id: 3, count: 10}, {id: 1, count: 1}, {id: 2, count: 2}];
const products = [product1, product2, product3];


test('mapCartData', () => {
    const mapped = mapCartData(data, products);
    expect(mapped).toEqual(mappedData);
});

test('getTotalSum', () => {
    expect(getTotalSum(mapCartData(data, products))).toBe(1100);
});

test('getProductCount', () => {
    expect(getProductCount(mapCartData(data, products))).toBe(13);
});
