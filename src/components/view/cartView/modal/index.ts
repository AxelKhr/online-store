import "./style.scss";

export function getModal(): HTMLElement {
    const modal = document.createElement('div') as HTMLElement;
    modal.classList.add('modal__wrap');

    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.addEventListener('click', closeModal);
    modal.innerHTML =`
    <form class="modal__window">
        <input class="modal__input" type="text" pattern="^\\w{3,}\\s+\\w{3,}$" required placeholder="Name">
        <input class="modal__input" type="tel" placeholder="Phone number" pattern="^[\+]\\d{9,}$" required>
        <input class="modal__input" type="text" placeholder="Address" pattern="^\\w{5,}\\s+\\w{5,}\\s+\\w{5,}$" required>
        <input class="modal__input" type="email" placeholder="E-mail" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" required>
        <button data-hystclose class="modal__confirm">Confirm</button>
    </form>`;
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal?.classList.add('hidden');
    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.classList.add('hidden');
}