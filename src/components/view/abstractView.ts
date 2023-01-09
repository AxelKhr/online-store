export abstract class AbstractView {
    constructor() {
        document.title = 'Online store';
    }

    setTitle(title: string) {
        document.title = title;
    }

    abstract getView(): Promise<HTMLElement>;

    async setView(title: string) {
        const view = await this.getView();
        const content = document.getElementById("content") as HTMLElement;
        if (content.dataset.viewName !== view.dataset.name) {
            content.dataset.viewName = view.dataset.name;
            content!.innerHTML = '';
            content.appendChild(view);
            document.title = title;
        }
    }
}