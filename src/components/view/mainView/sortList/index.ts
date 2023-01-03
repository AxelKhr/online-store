import "./style.scss";

export function createSortList(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.classList.add('sort-list');

    const select = document.createElement('select');
    const option1 = document.createElement('option');
    option1.textContent = 'Title';
    option1.value = 'title';
    const option2 = document.createElement('option');
    option2.textContent = 'Category';
    option2.value = 'category';
    const option3 = document.createElement('option');
    option3.textContent = 'Brand';
    option3.value = 'brand';
    select.append(option1, option2, option3);

    wrapper.append(select);
    return wrapper;
}