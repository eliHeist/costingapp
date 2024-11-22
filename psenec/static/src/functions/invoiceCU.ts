import { Customer, Item, JSONObject, JobCard, Invoice, Quotation } from "../classes/classes"
import { DELETE, GET, POST, PUT, apiURLS } from "./global"


export default ():any => ({
    // states
    saved: true,
    load: true,
    update_url: '',
    // objects
    edit_invoice: new Invoice(),
    invoice: new Quotation(),
    invoiced_items: [],
    items_left: [],
    total_price: 0,
    // functions
    async initialize(url:string, invoiced_items:any[], items_left:any[]){
        this.update_url = url
        console.log(url)
        this.invoiced_items = invoiced_items
        invoiced_items.forEach((item) => {
            this.total_price += item.price*item.quantity
        });
        this.items_left = items_left
        console.log(items_left)
        this.load = false
    },
    async handleSubmit(event:Event){
        event.preventDefault()
        this.load = true
        const obj = {"invoiced": this.invoiced_items}
        const response = await PUT(this.update_url, obj)
        console.log(response)
        this.load = false
    },
    addItem(itm:any){
        this.items_left = this.items_left.filter((value:any) => {
            return value != itm
        })
        this.invoiced_items.push(itm)
        this.total_price += itm.price*itm.quantity
    },
    removeItem(itm:any){
        this.invoiced_items = this.invoiced_items.filter((value:any) => {
            return value != itm
        })
        this.items_left.push(itm)
        this.total_price -= itm.price*itm.quantity
    },
})