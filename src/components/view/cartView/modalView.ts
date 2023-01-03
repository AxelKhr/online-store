export class ModalView {

    getView() {
        const bankNumber = document.querySelector('.modal__card-number') as HTMLInputElement;
        bankNumber?.addEventListener('keydown', (e) => this.cardNumberValid(e.target as HTMLInputElement, e));
    }

    private cardNumberValid(parent: HTMLInputElement, e: KeyboardEvent) {
        if((/[^0-9]/g.test(e.key) && e.key !== 'Backspace')) {
            e.preventDefault();
        } else if(e.key === 'Backspace' || parent.value.length < 19) {
            parent?.addEventListener('input', (e) => {
                let input = (<HTMLTextAreaElement>e.target);
                let str = input.value;
                input.value = str.split(/(\d{4})/).map(el => el.trim()).filter(item => item !== '').join(' ');
            });
        } else {
            e.preventDefault();
        }
    }
}