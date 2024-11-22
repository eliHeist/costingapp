import { Customer, Item, JSONObject, JobCard, Invoice, Quotation } from "../classes/classes"
import { DELETE, GET, POST, PUT, apiURLS } from "./global"


export default ():any => ({
    // states
    saved: true,
    load: true,
    create_invoice: false,
    pk: 0,
    urls: [],
    show_tab: 0, 
    active_class: 'bg-primary text-white',
    // objects
    edit_invoice: new Invoice(),
    edit_quotation: new Quotation(),
    items: [],
    addeditems: [],
    // functions
    async init(){
        this.urls = (await apiURLS()).data
        const urls:any = this.urls 
        this.pk = Number(String(window.location.pathname).split('/')[3])
        const response = await GET(`${urls.quotations}${this.pk}/`)
        this.edit_quotation = response.data
        this.items = response.data.uninvoiced_items
        this.load = false
    },
    async handleSubmit(event:Event){
        event.preventDefault()
        this.load = true
        console.log('submitted')
        console.log(this.addeditems)
        let urls = this.urls
        let obj = {
            'quotation': this.edit_quotation,
            'items': this.addeditems,
            'vat_inclusive': this.edit_invoice.vat,
        }
        const response = await POST(`${urls.addQInvoice}`.replace('0',String(this.edit_quotation.id)), obj)
        console.log(response)
        if (response.status) {
            this.items = this.items.filter(item => !this.addeditems.includes(item))
            this.edit_quotation = new Quotation()
            window.location.reload();
        }
        this.create_invoice = false
        this.closeSidePanel()
    },
    closeSidePanel(){
        this.edit_quotation = new Quotation()
        this.load = false
        this.create_invoice = false
    },
    addItem(itm:Item){
        this.items = this.items.filter((value:any) => {
            return value != itm
        })
        this.addeditems.push(itm)
    },
    addAllItems(){
        this.items.forEach(item => {
            this.addeditems.push(item)
        });
        this.items = []
    },
    removeItem(itm:Item){
        this.addeditems = this.addeditems.filter((value:any) => {
            return value != itm
        })
        this.items.push(itm)
    },
})