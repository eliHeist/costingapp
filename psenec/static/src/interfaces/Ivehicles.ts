import { Vehicle } from "../classes/classes";

export interface Ivehicles {
    open_side_panel:boolean
    load:boolean
    editVehicle: null|Vehicle,
    editElement: null|HTMLElement,
    edit(element:HTMLElement):void
    handleSubmit(event:Event):void
    init():void
}