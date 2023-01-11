import { AbstractView } from "../abstractView";

export class ErrorView extends AbstractView {

    async getView(): Promise<HTMLElement> {
        const content = document.createElement('section') as HTMLElement;
        content.classList.add('error-page');
        content.innerHTML = `
            <div class="error-message">
                <p class="error-text error-title">404</p>
                <p class="error-text">Page not found</p>
                <p class="error-text">The page you're looking for doesn't exist or an other error occured.</p>
            </div>
            <a href="#" class="error-btn">Back to main page</a>`;
        return content;
    }

    draw(): void {
        throw new Error("Method not implemented.");
    }
}
