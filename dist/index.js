class On {
    targets;
    eventObject;
    eventStack;
    constructor(targets, eventObject) {
        this.targets =
            typeof targets === "string"
                ? document.querySelectorAll(targets)
                : targets;
        this.eventObject = Object.freeze(eventObject);
        this.eventStack = new Map();
        for (const e in this.eventObject)
            this.eventStack.set(e, this.eventObject[e]);
        try {
            this.#add();
        }
        catch (error) {
            console.warn(error);
        }
    }
    #add() {
        if (this.targets instanceof NodeList) {
            this.targets.forEach((node) => {
                this.eventStack.forEach((v, k) => node.addEventListener(k, v.bind(node)));
            });
        }
        else {
            this.eventStack.forEach((v, k) => this.targets.addEventListener(k, v.bind(this.targets)));
        }
    }
    get stack() {
        const s = [];
        this.eventStack.forEach((v, k) => s.push(k));
        return s;
    }
    removeEvent(eventName = "") {
        if (this.targets instanceof NodeList && this.eventStack.has(eventName)) {
            this.targets.forEach((node) => node.removeEventListener(eventName, this.eventStack.get(eventName)));
            this.eventStack.delete(eventName);
        }
        else if (this.eventStack.has(eventName)) {
            this.targets.removeEventListener(eventName, this.eventStack.get(eventName));
            this.eventStack.delete(eventName);
        }
        else
            void 0;
    }
}
export default On;
