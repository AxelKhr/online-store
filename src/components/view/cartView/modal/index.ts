import "./style.scss";

export function getModal(): HTMLElement {
    const modal = document.createElement('div') as HTMLElement;
    modal.classList.add('modal__wrap');

    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.addEventListener('click', closeModal);
    modal.innerHTML =`
    <form class="modal__window">
        <div class="modal__personal">
            <p class="modal__title">Personal details</p>
            <input class="modal__input" type="text" pattern="^\\w{3,}\\s+\\w{3,}$" placeholder="Name Surname" required>
            <input class="modal__input" type="tel" placeholder="Phone number (+xxxxxxxxxxx)" pattern="^[\+]\\d{9,}$" required >
            <input class="modal__input" type="text" placeholder="Address" pattern="^\\w{5,}\\s+\\w{5,}\\s+\\w{5,}$" required>
            <input class="modal__input" type="email" placeholder="E-mail (example@email.com)" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$" required>
        </div>
        <p class="modal__title">Card details</p>
        <div class="modal__card-block">
            <input class="modal__input modal__card-number" type="text" placeholder="Card number" pattern="^\\d{4}\\s\\d{4}\\s\\d{4}\\s\\d{4}$" required>
            <div class="pay-logo"></div>
            <div class="modal__bottom-block">
                <input class="modal__input modal__date" type="text" placeholder="MM/YY" pattern="^([0][1-9]|1[0-2])\/\\d{2}$" required>
                <input class="modal__input modal__code" type="text" placeholder="CVC" pattern="^\\d{3}$" required>
            </div>
        </div>
        <button class="modal__btn">Confirm</button>
    </form>`;
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal?.classList.add('hidden');
    const modalShadow = document.querySelector('.modal__shadow');
    modalShadow?.classList.add('hidden');
}