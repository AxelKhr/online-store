import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://dummyjson.com/', {
            limit: '100',
        });
    }
}

export default AppLoader;