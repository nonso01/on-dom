class On {
  targets;
  eventObject;
  eventStack;
  constructor(targets, eventObject) {
    this.targets =
      typeof targets === "string"
        ? document.querySelectorAll(targets)
        : targets;
    this.eventObject = eventObject;
    this.eventStack = new Map();
    try {
      this.#add();
    } catch (e) {
      console.warn(e);
    }
  }
  #add() {
    if (this.targets instanceof NodeList) {
      this.targets.forEach((node) => {
        for (const evn in this.eventObject) {
          node.addEventListener(evn, this.eventObject[evn].bind(node));
          this.eventStack.set(evn, this.eventObject[evn]);
        }
      });
    } else {
      for (const evn in this.eventObject) {
        this.targets?.addEventListener(
          evn,
          this.eventObject[evn].bind(this.targets),
        );
        this.eventStack.set(evn, this.eventObject[evn]);
      }
    }
  }
  get stack() {
    const s = [];
    this.eventStack.forEach((v, k) => s.push(k));
    return s;
  }
  removeEvent(eventName) {
    if (this.targets instanceof NodeList && this.eventStack.has(eventName)) {
      this.targets.forEach((node) =>
        node.removeEventListener(eventName, this.eventStack.get(eventName)),
      );
      this.eventStack.delete(eventName);
    } else if (this.eventStack.has(eventName)) {
      this.targets.removeEventListener(
        eventName,
        this.eventStack.get(eventName),
      );
      this.eventStack.delete(eventName);
    } else void 0;
  }
}
export default On;
