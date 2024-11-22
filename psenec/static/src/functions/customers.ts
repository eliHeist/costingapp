import { Customer } from "../classes/classes";
import { Icustomers } from "../interfaces/Icustomers";
import { PUT } from "./global";

declare const updateUrl: string

export default ():any => ({
    open_side_panel: false,
    load: true,
    editCustomer: {},
    editElement: null,
    edit(element:HTMLElement){
        const customer = new Customer(element.getAttribute('data-name'), element.getAttribute('data-email'), element.getAttribute('data-contact_1'), element.getAttribute('data-contact_2'), element.getAttribute('data-address'), element.getAttribute('data-id'))
        this.editElement = element
        this.editCustomer = customer
        this.open_side_panel = true
    },
    async handleSubmit(event){
        event.preventDefault()
        this.load = true
        if (this.editCustomer) {
            const response = await PUT(updateUrl,this.editCustomer)
            if (response.status == 200) {
                location.reload()
            } else {
                alert(response.message)
            }
        }
        this.load = false
    },
    init(){
        this.load = false
    }
})