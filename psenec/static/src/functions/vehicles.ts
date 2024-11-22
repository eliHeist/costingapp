import { Vehicle } from "../classes/classes";
import { Ivehicles } from "../interfaces/Ivehicles";
import { GET, POST, PUT, apiURLS } from "./global";

declare const updateUrl: string

export default ():any => ({
    open_side_panel: false,
    load: true,
    editVehicle: null,
    editElement: null,
    edit(element:HTMLElement){
        const vehicle = new Vehicle(element.getAttribute('data-plate_number'), element.getAttribute('data-engine_number'), element.getAttribute('data-chasis_number'), element.getAttribute('data-make'), element.getAttribute('data-model'), element.getAttribute('data-year'), element.getAttribute('data-id'))
        console.log(vehicle)
        this.editElement = element
        this.editVehicle = vehicle
        this.open_side_panel = true
    },
    async handleSubmit(event){
        event.preventDefault()
        this.load = true
        if (this.editVehicle) {
            const response = await PUT(updateUrl,this.editVehicle)
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