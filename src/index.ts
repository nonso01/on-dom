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
      this.targets.forEach((node: Node) => {
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
    const s: string[] = [];
    this.eventStack.forEach((v: Function, k: string) => s.push(k));
    return s;
  }

  removeEvent(eventName: EventName) {
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

let num = 0;
let a: On = new On("html", {
  click() {
    num++;
    alert(num);
  },
});
console.log(a);
export default On;
