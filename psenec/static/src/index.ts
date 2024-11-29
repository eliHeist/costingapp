import Alpine from "alpinejs";
import mask from "@alpinejs/mask"
import collapse from "@alpinejs/collapse"


import './main.scss';
import 'htmx.org';


Alpine.plugin(mask)
Alpine.plugin(collapse)

Alpine.start()

document.addEventListener('htmx:afterSwap', (event:any) => {
    const xDataElements = event.detail.target.querySelectorAll('[x-data]');
    xDataElements.forEach(element => {
        // If Alpine was already initialized on this element, destroy the existing instance
        if (element.__x) {
            element.__x.cleanups.forEach(cleanup => cleanup()); // Cleanup existing Alpine instance
            delete element.__x; // Remove Alpine's reference
        }
        // Re-initialize Alpine
        Alpine.initTree(element);
    });
});
