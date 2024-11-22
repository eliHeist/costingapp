import Alpine from "alpinejs";
import mask from "@alpinejs/mask"
import collapse from "@alpinejs/collapse"
import flatpickr from "flatpickr";

declare const html2pdf;

import './main.scss';
import 'htmx.org';
// import './functions/jobcards'

import { previewImage } from './functions/input_fields'
import invoiceForm from './functions/invoiceForm';
import invoiceReceipts from "./functions/invoiceReceipts";
import incomeForm from "./functions/incomeForm";
import vehicles from "./functions/vehicles";
import customers from "./functions/customers";
import invoiceCU from "./functions/invoiceCU";
import dashboard from "./functions/dashboard";
import externalVehicles from "./functions/externalVehicles";

import TableFunctions from './ts/table-functions';

declare var theme: string

// creates multiple instances
flatpickr('#id_date_cleared', {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

// image inputs
document.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.type === "file" && target.accept === "image/*") {
        console.log('updated')
        previewImage(event);
    }
});


// get csrf
let csrf: string = ''
try {
    const token = document.querySelector("#token > input[type=hidden]") as HTMLInputElement;
    csrf = token.value
}
catch (error) { }


// date inputs
flatpickr(".datePicker-Input", {
    minDate: "2020-01",
    dateFormat: "D . d . M . Y",
    defaultDate: new Date()
});

// nav
let mainContainer = document.querySelector('.scroll-container') as HTMLElement
if (mainContainer){
    let prevScrollpos: number = mainContainer.scrollTop;
    mainContainer.addEventListener('scroll', () => {
        let currentScrollPos: number = mainContainer.scrollTop;
    
        const hamburgerElement = document.querySelector('.hamburger-btn') as HTMLElement;
    
        if (hamburgerElement) {
            if (prevScrollpos > currentScrollPos) {
                // Scrolling up
                hamburgerElement.style.opacity = '1';
                hamburgerElement.style.pointerEvents = 'auto';
            } else {
                // Scrolling down
                hamburgerElement.style.opacity = '0';
                hamburgerElement.style.pointerEvents = 'none';
            }
        }
    
        prevScrollpos = currentScrollPos;
    })
}


Alpine.data('invoiceCU', invoiceCU)
Alpine.data('invoiceForm', invoiceForm)
Alpine.data('invoiceReceipts', invoiceReceipts)
Alpine.data('incomeForm', incomeForm)
Alpine.data('vehicles', vehicles)
Alpine.data('customers', customers)
Alpine.data('dashboard', dashboard)
Alpine.data('externalVehicles', externalVehicles)

declare const JCCUdata
Alpine.data('JCCU', () => (JCCUdata))

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

document.addEventListener('load', () => {
    function switchTabs(el) {
        console.log('element')
        const tabs = el.parentElement.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active-tab');
        })
        el.classList.add('active-tab');
    }
})



// buttons ===================
const loaderButtons = document.querySelectorAll('.load-btn') as NodeListOf<HTMLButtonElement>

loaderButtons.forEach((button: HTMLElement) => {
    const loader = document.createElement('div') as HTMLDivElement
    loader.classList.add('button--loader')
    loader.innerHTML = `<div></div><div></div><div></div>`
    button.appendChild(loader)
});



// Initialize all modules
const initializeModules = () => {
    // Initialize table functions if table exists
    const dataTable = document.getElementById('data_table');
    if (dataTable) {
        new TableFunctions();
    }
};

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeModules);


