import "./style.scss"

export function createPathList(selClass: string) {
    const pathList = document.createElement('ul');
    pathList.classList.add('list-links', selClass);
    return pathList;
}

export function addToPathList(selClass: string, title: string, href: string) {
    const pathList = document.querySelector(`.${selClass}`) as HTMLUListElement;
    const pathItem = document.createElement('li');
    const pathLink = document.createElement('a');
    pathLink.textContent = title;
    pathLink.href = href;
    pathItem.append(pathLink);
    pathList.append(pathItem);
}