# on-dom

Listen to DOM events with minimal effort

---

> The `On` class  attaches multiple events to target HTMLElements, ElementRefs, or NodeLists all at once.

## Usage

> The `On` class accepts just **two** arguments: `targets` and `eventObject`.
> 
> `targets` can be a **string selector**, **DOM element**, **HTMLElement**, **Window**, **Document**, or **NodeList**.
>
> String selectors are automatically normalized into a NodeList if elements are found.
>
> The `eventObject` is an object containing **event names** as keys and their corresponding **event handlers** (functions) as values.

### Installation
```
npm install on-dom

or

pnpm install on-dom
```

### Examples

---
```js
import On from "on-dom";

// ============================================================================
// BASIC USAGE
// ============================================================================

// 1. Single element with multiple events
const button = new On(".my-button", {
  click(e: Event) {
    console.log("Button clicked!", e);
  },
  mouseenter() {
    console.log("Mouse entered");
  },
  mouseleave() {
    console.log("Mouse left");
  },
});

// 2. Multiple elements with CSS selector
const links = new On("a.external", {
  click(e: Event) {
    e.preventDefault();
    console.log("External link clicked");
  },
});

// 3. Window events
const windowEvents = new On(window, {
  scroll(e: Event) {
    if ((e.target as Window).scrollY > 100) {
      console.log("Scrolled past 100px");
    }
  },
  resize(e: Event) {
    console.log("Window resized");
  },
});

// 4. Document events
const docEvents = new On(document, {
  DOMContentLoaded() {
    console.log("DOM loaded");
  },
  keydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      console.log("Escape pressed");
    }
  },
});

// 5. NodeList (already selected elements)
const selected = document.querySelectorAll(".card");
const cardEvents = new On(selected, {
  click() {
    console.log("Card clicked:", this);
  },
});

// ============================================================================
// EVENT REMOVAL
// ============================================================================

const form = new On("form", {
  submit(e: Event) {
    e.preventDefault();
    console.log("Form submitted");
  },
  input(e: Event) {
    console.log("Input changed");
  },
});

// Remove specific event
form.removeEvent("input");
console.log(form.stack); // ['submit'] - 'input' is gone

// Remove all events
form.removeAllEvents();
console.log(form.stack); // [] - all events removed

// ============================================================================
// CLEANUP FOR SPAs
// ============================================================================

class Modal {
  private events: On | null = null;

  open() {
    const modal = document.getElementById("modal");
    this.events = new On(modal, {
      click: (e: Event) => {
        if ((e.target as HTMLElement).classList.contains("close")) {
          this.close();
        }
      },
    });
  }

  close() {
    // IMPORTANT: Clean up listeners when modal closes
    if (this.events) {
      this.events.destroy();
      this.events = null;
    }
  }
}

// Usage
const modal = new Modal();
modal.open();
// ... later ...
modal.close(); //  All listeners removed, no memory leak!

// ============================================================================
// DEBUGGING AND INSPECTION
// ============================================================================

const myEvents = new On(".item", {
  click() {},
  hover() {},
  focus() {},
});

console.log(myEvents.stack); // ['click', 'hover', 'focus']
console.log(myEvents.listenerCount); // 3 (or more if multiple elements)
console.log(myEvents.trackedListeners); // Full listener objects for debugging
console.log(myEvents.destroyed); // false

// ============================================================================
// ARROW FUNCTIONS
// ============================================================================

const element = new On("#search", {
  // Regular function - 'this' = element
  input(e: Event) {
    console.log("Element:", this);
  },

  // Arrow function - now properly scoped
  keydown: (e: KeyboardEvent) => {
    console.log("Search input");
  },
});
```