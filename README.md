# on-dom

Listen to your DOM events with a mini function 🤏🏾

### Here is how it works

> the `On` class accepts just **two** arguments, `targets` and `eventObject`.
> `targets` here can either be a **string**, **DOM Ref**, **HTMLElement**, **NodeList**
> the **string** gets converted into a NodeList, if at all it's present in the DOM.

> the `eventObject` on the other hand is an Object comprised of , **eventName** and **eventHandler** or `methods`.
> this `key/value` pair gets stored in a **Map** for other operations.

### example

---

```js
import On from "on-dom";

const nodeOrNodeLIst = On(window, {
  scroll() {
    if (this.scrollY > 100) console.log("show your nav bruh");
  },
  animationend(e) {
    /* (e) here is basically Event*/
    /* so things like
     * e.stopPropagation()
     * will work just fine
     */
    console.log(`an animation just ended on ${e.target.tagName} element`);
  },
  wheel(e) {
    // you can add as many events as needed
  },
});
```

### javaScript **this**

> within the `eventObject` methods, `this` here represents the `targets` arguments.
> you can use it as you wish, because it's the same as the `targets`

```js
import On from "on-dom";

let num = 0;
const whyThis = on("html", {
  click: function (e) {
    num++;
    if (num >= 5) {
      const anotherOne = On(this, {
        touchmove(e) {
          // this here is still the HTMLHtmlElement
        },
      });
    }
  },
});
```

> the `On` class returns a couple of Objects as well. Will be discussed later, but for now simply add events with `new On()`
