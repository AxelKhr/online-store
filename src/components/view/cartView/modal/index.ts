import "./style.scss";

export function getModal(): HTMLElement {
    const modal = document.createElement('div') as HTMLElement;
    modal.classList.add('modal__wrap');

    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.addEventListener('click', closeModal);
    modal.innerHTML =`
    <div class="modal__window">
        <input class="modal__input" type="text" placeholder="Name">
        <input class="modal__input" type="text" placeholder="Phone number">
        <input class="modal__input" type="text" placeholder="Address">
        <input class="modal__input" type="text" placeholder="E-mail">
        <button data-hystclose class="modal__confirm">Confirm</button>
    </div>`;
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal?.classList.add('hidden');
    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.classList.add('hidden');
}