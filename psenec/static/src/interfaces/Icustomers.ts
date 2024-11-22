import { Customer } from "../classes/classes"

export interface Icustomers {
    open_side_panel:boolean
    load:boolean
    editCustomer: null|Customer,
    editElement: null|HTMLElement,
    edit(element:HTMLElement):void
    handleSubmit(event:Event):void
    init():void
}