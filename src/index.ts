type Targets = string | NodeList | any; // => replace this
type EventName = string;
type EventStack = Map<string, Function | any>; // => replace this

interface EventObject {
  [key: string]: (e?: Event) => void;
}

class On {
  targets: Targets;
  eventObject: EventObject;
  eventStack: EventStack;
  constructor(targets: Targets, eventObject: EventObject) {
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
    } catch (error) {
      console.warn(error);
    }
  }

  #add() {
    if (this.targets instanceof NodeList) {
      this.targets.forEach((node: Node) => {
        this.eventStack.forEach((v: any /* function */, k: string) =>
          node.addEventListener(k, v.bind(node)),
        );
      });
    } else {
      this.eventStack.forEach((v: any, k: string) =>
        this.targets.addEventListener(k, v.bind(this.targets)),
      );
    }
  }

  get stack() {
    const s: string[] = [];
    this.eventStack.forEach((v: any /* function */, k: string) => s.push(k));
    return s;
  }

  removeEvent(eventName: EventName = "") {
    /* issue
     * removing the event
     */
    if (this.targets instanceof NodeList && this.eventStack.has(eventName)) {
      this.targets.forEach((node: Node) =>
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
