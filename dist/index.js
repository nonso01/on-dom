/**
 * On-DOM - A robust, memory-safe DOM event listener management library
 * Fixes: memory leaks, weak typing, missing cleanup, event removal bugs
 */
/**
 *   DOM event listener manager
 * - Proper memory management with listener tracking
 * - Full type safety
 * - Working event removal
 * - Cleanup methods
 * - Error handling
 */
class On {
    targets;
    eventObject;
    listeners = [];
    isDestroyed = false;
    constructor(targets, eventObject) {
        // Validate inputs
        if (!targets) {
            throw new Error("[On] targets cannot be null or undefined");
        }
        if (!eventObject || typeof eventObject !== "object") {
            throw new Error("[On] eventObject must be a valid object");
        }
        // Parse targets into normalized array
        this.targets = this.normalizeTargets(targets);
        // Store the event object (allows future modifications)
        this.eventObject = eventObject;
        // Attach all listeners
        this.addEvents();
    }
    /**
     * Normalizes various target types into usable format
     */
    normalizeTargets(targets) {
        if (targets === window || targets === document) {
            return targets;
        }
        if (typeof targets === "string") {
            const elements = document.querySelectorAll(targets);
            if (elements.length === 0) {
                console.warn(`[On] Selector "${targets}" matched no elements in the DOM`);
            }
            return Array.from(elements);
        }
        // Handle single HTMLElement
        if (targets instanceof HTMLElement) {
            return [targets];
        }
        // Handle NodeList
        if (targets instanceof NodeList) {
            return Array.from(targets);
        }
        // Handle HTMLCollection
        if (targets instanceof HTMLCollection) {
            return Array.from(targets);
        }
        throw new Error(`[On] Invalid target type. Expected string, HTMLElement, Window, Document, NodeList, or HTMLCollection`);
    }
    /**
     * Adds all event listeners with proper binding and tracking
     */
    addEvents() {
        const targetsList = Array.isArray(this.targets)
            ? this.targets
            : [this.targets];
        for (const eventName in this.eventObject) {
            if (this.eventObject.hasOwnProperty(eventName)) {
                const handler = this.eventObject[eventName];
                targetsList.forEach((target) => {
                    this.attachListener(target, eventName, handler);
                });
            }
        }
    }
    /**
     * Attaches a single listener and tracks it for removal
     */
    attachListener(target, eventName, handler) {
        // Determine the correct context (this) for the handler
        const context = target === window || target === document ? target : target;
        // Create a bound handler that preserves the correct 'this'
        const boundHandler = handler.bind(context);
        // Store listener reference for cleanup
        const storedListener = {
            event: eventName,
            handler,
            boundHandler,
            target,
        };
        this.listeners.push(storedListener);
        // Attach to the target
        target.addEventListener(eventName, boundHandler);
    }
    /**
     * Get all currently attached event names
     */
    get stack() {
        if (this.isDestroyed) {
            console.warn("[On] Cannot access stack on destroyed instance");
            return [];
        }
        return Array.from(new Set(this.listeners.map((l) => l.event)));
    }
    /**
     * Remove a specific event listener
     * @param eventName - The name of the event to remove (e.g., 'click', 'scroll')
     * @returns true if event was removed, false if not found
     */
    removeEvent(eventName) {
        if (this.isDestroyed) {
            console.warn("[On] Cannot remove events on destroyed instance");
            return false;
        }
        if (!eventName || typeof eventName !== "string") {
            console.warn("[On] Invalid event name provided to removeEvent");
            return false;
        }
        const initialLength = this.listeners.length;
        // Find and remove all listeners for this event
        this.listeners = this.listeners.filter((listener) => {
            if (listener.event === eventName) {
                listener.target.removeEventListener(listener.event, listener.boundHandler);
                return false; // Remove from tracked listeners
            }
            return true;
        });
        const removed = this.listeners.length < initialLength;
        if (!removed) {
            console.warn(`[On] Event "${eventName}" not found`);
        }
        return removed;
    }
    /**
     * Remove a specific event listener from specific target(s)
     * @param eventName - The name of the event to remove
     * @param target - Optional specific target (if not provided, removes from all targets)
     */
    removeEventFromTarget(eventName, target) {
        if (this.isDestroyed) {
            console.warn("[On] Cannot remove events on destroyed instance");
            return false;
        }
        const initialLength = this.listeners.length;
        this.listeners = this.listeners.filter((listener) => {
            const eventMatches = listener.event === eventName;
            const targetMatches = !target || listener.target === target;
            if (eventMatches && targetMatches) {
                listener.target.removeEventListener(listener.event, listener.boundHandler);
                return false;
            }
            return true;
        });
        return this.listeners.length < initialLength;
    }
    /**
     * Remove all event listeners and clean up
     */
    removeAllEvents() {
        if (this.isDestroyed) {
            console.warn("[On] Instance already destroyed");
            return;
        }
        this.listeners.forEach((listener) => {
            listener.target.removeEventListener(listener.event, listener.boundHandler);
        });
        this.listeners = [];
    }
    /**
     * Completely destroy the instance and remove all listeners
     * Call this when you're done with the instance (e.g., component unmount)
     */
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this.removeAllEvents();
        this.isDestroyed = true;
    }
    /**
     * Get the number of attached listeners
     */
    get listenerCount() {
        return this.listeners.length;
    }
    /**
     * Check if instance has been destroyed
     */
    get destroyed() {
        return this.isDestroyed;
    }
    /**
     * Get all tracked listeners (for debugging)
     */
    get trackedListeners() {
        return [...this.listeners];
    }
}
export default On;
