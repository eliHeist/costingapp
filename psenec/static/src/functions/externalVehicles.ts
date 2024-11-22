import { Vehicle } from "../classes/classes"
import { GET, POST, PUT, apiURLS } from "./global"

declare function refreshSearchTable(): any
export default () => ({
    add_mode: false,
    update: false,
    load: true,
    urls: [],
    search_text: '',

    vehicles: [],
    vehicles_matched: [],
    free_vehicles: [],
    add_vehicle_show: false,
    vehicle_picker: false,
    show_vehicles: false,
    vehicleSelected: false,
    vehicleEdit: new Vehicle(),

    external_mechanics: [],
    external_mechanics_matched: [],
    add_external_mechanic_show: false,
    external_mechanic_picker: false,
    show_external_mechanics: false,
    external_mechanicSelected: false,
    external_mechanicEdit: { 'name': '', 'phone_1': '' },

    users: [],
    users_matched: [],
    user_picker: false,
    show_users: false,
    userSelected: false,

    jobcard: { "id": null, "vehicle": 0, "mechanic": 0, "user": 0, "check_in_date": null, "check_out_date": null, "description": null },    
    j_id: 0,

    filter_mechanic_id: null,
    filter_user_id: null,
    filter_status: 'all',

    requestSubmit() {
        const form = document.getElementById("form") as HTMLFormElement
        form.requestSubmit()
    },
    async initialize(urls, vehicles, external_mechanics, users, jobcard = null) {
        // urls,vehicles,extjcs,extmechs,users,jc
        this.urls = urls

        this.users = users
        this.users_matched = users
        this.vehicles = vehicles
        this.free_vehicles = vehicles.filter(jobcard => jobcard.free === true)
        this.vehicles_matched = this.free_vehicles
        this.external_mechanics = external_mechanics
        this.external_mechanics_matched = external_mechanics

        if (jobcard) {
            this.update = true
            this.jobcard = jobcard
        }
        refreshSearchTable()
        this.load = false
    },

    closeForm() {
        this.show_customers = false
        this.show_vehicles = false
    },
    show_picker(index: number) {
        if (index == 1) {
            // its vehicle form
            this.vehicle_picker = true
            let selector = 'vehicle-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.vehicle_picker = false
                }
            })
        }
        else if (index == 2) {
            // external_mechanic form default
            this.external_mechanic_picker = true
            let selector = 'external_mechanic-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.external_mechanic_picker = false
                }
            })
        }
        else if (index == 3) {
            // user form default
            this.user_picker = true
            let selector = 'user-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.user_picker = false
                }
            })
        }
    },
    pickerSelect(object: any, index: number) {
        if (index == 1) {
            this.vehicleSelected = object
            this.vehicle_picker = false
        } else if (index == 2) {
            this.external_mechanicSelected = object
            this.external_mechanic_picker = false
        } else if (index == 3) {
            this.userSelected = object
            this.user_picker = false
        }
    },
    handleSearch(event: Event, num: number) {
        const field = event.target as HTMLInputElement
        const value = field.value.toLowerCase()
        if (num == 1) {
            let new_list: Vehicle[] = []
            this.free_vehicles.forEach((vehicle: Vehicle) => {
                const plate_number: string | undefined = vehicle.plate_number?.toLowerCase()
                if (plate_number?.includes(value)) {
                    new_list.push(vehicle)
                }
            });
            this.vehicles_matched = new_list
        } else if (num == 2) {
            let new_list: any[] = []
            this.external_mechanics.forEach((external_mechanic: any) => {
                const name: string = external_mechanic.name?.toLowerCase()
                const phone_1: string = external_mechanic.phone_1?.toLowerCase()
                if (name?.includes(value) || phone_1?.includes(value)) {
                    new_list.push(external_mechanic)
                }
            });
            this.external_mechanics_matched = new_list
        } else if (num == 3) {
            let new_list: any[] = []
            this.users.forEach((user: any) => {
                const first_name: string = user.first_name?.toLowerCase()
                const last_name: string = user.last_name?.toLowerCase()
                const username: string = user.username?.toLowerCase()
                const phone_1: string = user.phone_1?.toLowerCase()
                const phone_2: string = user.phone_2?.toLowerCase()
                const email: string = user.email?.toLowerCase()
                if (first_name?.includes(value) || phone_1?.includes(value) || last_name?.includes(value) || username?.includes(value) || phone_2?.includes(value) || email?.includes(value)) {
                    new_list.push(user)
                }
            });
            this.users_matched = new_list
        }
    },
    async handleVehicleSubmit(event: Event) {
        event.preventDefault()
        this.load = true
        const urls = this.urls
        const response = await POST(urls.vehicles, this.vehicleEdit)
        if (response.status == 200) {
            this.pickerSelect(response.data, 1)
            this.vehicles.push(response.data)
        } else {
            alert(JSON.stringify(response.message))
        }
        this.load = false
    },
    async handleMechanicSubmit() {
        this.load = true
        const urls = this.urls
        const response = await POST(urls.external_mechanics, this.external_mechanicEdit)
        if (response.status == 200) {
            this.pickerSelect(response.data, 2)
            this.external_mechanics.push(response.data)
        } else {
            alert(JSON.stringify(response.message))
        }
        this.load = false
    },
    async handleSubmit(event: Event = null) {
        if (event) {
            event.preventDefault()
        }
        this.load = true
        const urls = this.urls
        const jobcard = this.jobcard

        // console.log(`POST to ${urls.external_jobcards}`)
        jobcard.vehicle = this.vehicleSelected.id
        if (this.external_mechanicSelected) {
            jobcard.mechanic = this.external_mechanicSelected.id
        } else {
            jobcard.mechanic = null
        }
        if (this.userSelected) {
            jobcard.user = this.userSelected.id
        } else {
            jobcard.user = null
        }
        jobcard.id = this.j_id

        if (!jobcard.check_in_date) {
            console.log("No Jobcard Check in date")
            alert("No Jobcard Check in date")
            this.load = false
            return
        }

        const response = await POST(urls.external_jobcards, jobcard)

        if (response.status == 200) {
            this.jobcards.unshift(response.data)
        } else {
            console.log(response)
            alert(JSON.stringify(response.message))
        }
        window.location.reload()
        this.add_mode = false
        this.load = false
        this.clearForm()
        refreshSearchTable()
    },

    getMechanicById(id: number): Object | any {
        return this.external_mechanics.find((obj) => obj.id === id);
    },
    getVehicleById(id: number): Object | any {
        return this.vehicles.find((obj) => obj.id === id);
    },
    getUserById(id: number): Object | any {
        return this.users.find((obj) => obj.id === id);
    },
    calculateDuration(startDate: string, endDate?: string | null): number {
        const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

        const startMatch = startDate.match(dateRegex);
        const endMatch = endDate ? endDate.match(dateRegex) : null;

        if (!startMatch) {
            throw new Error("Invalid start date format");
        }

        const [, startYear, startMonth, startDay] = startMatch;
        const [, endYear, endMonth, endDay] = endMatch || [];

        let endDateObj: Date;

        if (endMatch && endYear && endMonth && endDay) {
            endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);
        } else {
            endDateObj = new Date();
        }

        const startDateObj = new Date(`${startYear}-${startMonth}-${startDay}`);

        // Calculate the duration in milliseconds
        const durationInMilliseconds = endDateObj.getTime() - startDateObj.getTime();

        // Convert milliseconds to days and round off to the nearest integer
        const durationInDays = Math.round(durationInMilliseconds / (1000 * 60 * 60 * 24));

        return Math.abs(durationInDays);
    },
    clearForm(): void {
        this.jobcard.id = null
        this.jobcard.vehicle = null
        this.jobcard.mechanic = null
        this.jobcard.user = null
        this.jobcard.check_in_date = null
        this.jobcard.check_out_date = null
        this.jobcard.description = null

        this.vehicleSelected = false;
        this.userSelected = false
        this.external_mechanicSelected = false
        this.j_id = null
    },

    filterFunc(): void {
        let filtered = this.jobcards;
        console.log(filtered)
        if (this.filter_status == 'open') {
            filtered = filtered.filter((obj) => obj.closed == false)
        } else if (this.filter_status == 'closed') {
            filtered = filtered.filter((obj) => { obj.closed == true })
        }
        if (this.filter_mechanic_id) {
            filtered = filtered.filter((obj) => obj.mechanic == this.filter_mechanic_id)
        }
        if (this.filter_user_id) {
            filtered = filtered.filter((obj) => obj.user == this.filter_user_id)
        }
        this.jobcards_matched = filtered
    },
})