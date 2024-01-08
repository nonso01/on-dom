# on-dom

Listen to your DOM events with a mini function 🤏🏾

### How does it works

```js
import On from "on-dom";

const domElement = new On("div", {
  pointerover(e) {
    e.preventDefault();
    /* etc */
  },
  wheel(e) {},
  scroll() {
    // you can attach as much events as desired
  },
});
```
