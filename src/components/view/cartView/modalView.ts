import { Card } from "../../enum/card";

export class ModalView {

    getView() {
        const modal = document.querySelector('.modal__window') as HTMLElement;

        const bankNumber = document.querySelector('.modal__card-number') as HTMLInputElement;
        bankNumber.addEventListener('keydown', (e) => this.cardValid(e.target as HTMLInputElement, e));

        const cvNumber = document.querySelector('.modal__code') as HTMLInputElement;
        cvNumber.addEventListener('keydown', (e) => this.cvValid(e.target as HTMLInputElement, e));

        const dateMonth = document.querySelector('.modal__date') as HTMLInputElement;
        dateMonth.addEventListener('keydown', (e) => this.dateValid(e.target as HTMLInputElement, e));

        const btn = document.querySelector('.modal__btn') as HTMLElement;
        btn.addEventListener('click', (e) => { 
            e.preventDefault();
            localStorage.removeItem('cart-storage');
            localStorage.removeItem('promo');
            modal.innerHTML = `
                <div class='success'></div>
                <p class='success-title'>Success!</p>
                <p class='success-redirect'>You'll be redirected to the main page</p>
            `;
            setTimeout(() => window.location.href = '/', 2000);
        });
    }

    private cardValid(parent: HTMLInputElement, e: KeyboardEvent) {
        const payLogo = document.querySelector('.pay-logo') as HTMLElement;
        if((/[^0-9]/g.test(e.key) && (e.key !== 'Delete' && e.key !== 'Backspace'))) {
            e.preventDefault();
        } else if((e.key === 'Backspace' || e.key === 'Delete') || parent.value.length < 19) {
            parent?.addEventListener('input', (e) => {
                let input = (<HTMLTextAreaElement>e.target);
                let str = input.value.split('').map(el => el.replace(' ', '')).join('');
                switch(+str.slice(0, 1)) {
                    case Card.AMERICAN: 
                        payLogo.innerHTML = '<div class="american"></div>';
                        break;
                    case Card.VISA:
                        payLogo.innerHTML = '<div class="visa"></div>';
                        break;
                    case Card.MASTER:
                        payLogo.innerHTML = '<div class="master"></div>';
                        break;
                    default:
                        payLogo.innerHTML = '';
                        break;
                }
                input.value = str.split(/(\d{4})/).map(el => el.trim()).filter(item => item !== '').join(' ');
            });
        } else {
            e.preventDefault();
        }
    }

    private cvValid(parent: HTMLInputElement, e: KeyboardEvent) {
        if((/[0-9]/g.test(e.key) && parent.value.length === 3) 
                || (/[^0-9]/g.test(e.key) && e.key !== 'Backspace')) {
            e.preventDefault();
        }
    }

    private dateValid(parent: HTMLInputElement, e: KeyboardEvent) {
        if((/[^0-9]/g.test(e.key) && e.key !== 'Backspace')) {
            e.preventDefault();
        } else if(e.key === 'Backspace' || parent.value.length < 5) {
            parent?.addEventListener('input', (e) => {
                let input = (<HTMLTextAreaElement>e.target);
                let str = input.value.split('').map(el => el.replace('/', '')).join('');
                input.value = str.split(/(\d{2})/).map(el => el.trim()).filter(item => item !== '').join('/');
            });
        } 
        else {
            e.preventDefault();
        }
    }
}