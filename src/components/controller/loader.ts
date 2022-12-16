class Loader {

    private readonly baseLink: string;
    
    constructor(baseLink: string) {
        this.baseLink = baseLink;
    }

    load(): void {
        fetch(this.baseLink)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log('data', data)
            })
    }
}

export default Loader;