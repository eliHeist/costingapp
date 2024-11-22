import { Checklist, Customer, Issue, JobCard, Vehicle } from "../classes/classes"
import { IjobCardForm } from "../interfaces/Ifunctions"
import { GET, POST, PUT, apiURLS } from "./global"


export default (): any => ({
    customers: [],
    customers_matched: [],
    vehicles: [],
    vehicles_matched: [],
    issues: [],
    diagnostics: [],
    // states
    update_state: false,
    add_customer_show: false,
    add_vehicle_show: false,
    customer_picker: false,
    vehicle_picker: false,
    show_customers: false,
    show_vehicles: false,
    load: true,
    issue_count: 0,
    diagnostic_count: 0,
    // objects
    customerSelected: false,
    vehicleSelected: false,
    customerEdit: new Customer(),
    vehicleEdit: new Vehicle(),
    checklist: new Checklist(),
    jobcard: new JobCard(),
    jobcard_types: [],
    selected_jobcard_types: [],
    conditions: [],
    selected_conditions: [],
    urls: {},
    url: '',
    // state methods
    closeForm() {
        this.show_customers = false
        this.show_vehicles = false
    },
    show_picker(index: number) {
        if (index != 0) {
            // its vehicle form
            this.vehicle_picker = true
            let selector = 'vehicle-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.vehicle_picker = false
                }
            })
        } else {
            // customer form default
            this.customer_picker = true
            let selector = 'customer-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.customer_picker = false
                }
            })
        }
    },
    pickerSelect(object: Customer | Vehicle, index: number) {
        if (index == 0) {
            this.customerSelected = object
            this.customer_picker = false
        } else if (index == 1) {
            this.vehicleSelected = object
            this.vehicle_picker = false
        }
    },
    addTask(num = 0) {
        let q = new Issue(++this.issue_count)
        if (num == 0) {
            this.issues.push(q)
        }
        else if (num == 1) {
            this.diagnostics.push(q)
        }
    },
    removeTask(task: Issue, num = 0) {
        let temp: Issue[] = []
        if (num == 0) {
            this.issues.forEach((issue: Issue) => {
                if (issue != task) {
                    temp.push(issue)
                }
            })
            this.issues = temp
        }
        else if (num == 1) {
            this.diagnostics.forEach((issue: Issue) => {
                if (issue != task) {
                    temp.push(issue)
                }
            })
            this.diagnostics = temp
        }
    },
    handleSearch(event: Event, num: number) {
        const field = event.target as HTMLInputElement
        if (num == 0) {
            let new_list: Customer[] = []
            this.customers.forEach((customer: Customer) => {
                const name: string | undefined = customer.name?.toLowerCase()
                if (name?.includes(field.value.toLowerCase())) {
                    new_list.push(customer)
                }
            });
            this.customers_matched = new_list
        } else if (num == 1) {
            let new_list: Vehicle[] = []
            this.vehicles.forEach((vehicle: Vehicle) => {
                const plate_number: string | undefined = vehicle.plate_number?.toLowerCase()
                if (plate_number?.includes(field.value.toLowerCase())) {
                    new_list.push(vehicle)
                }
            });
            this.vehicles_matched = new_list
        }
    },
    requestSubmit() {
        const form = document.getElementById('jobCardForm') as HTMLFormElement
        form.requestSubmit()
    },
    async handleFormSubmit(event: Event) {
        event.preventDefault()
        console.log('Submit')
        this.load = true
        const form = event.target as HTMLFormElement
        if (!this.customerSelected) {
            console.log('customer not selected ❌')
            // add orange border
            const customerWrapper = form.querySelector('#customer-input .objectInputWrapper') as HTMLDivElement
            customerWrapper.classList.add('error')
            // add error message
            const errorP = customerWrapper.querySelector('p.errors') as HTMLParagraphElement
            errorP.innerText = `Please select a Customer`
            return
        }
        if (!this.vehicleSelected) {
            console.log('vehicle not selected ❌')
            // add orange border
            const vehicleWrapper = form.querySelector('#vehicle-input .objectInputWrapper') as HTMLDivElement
            vehicleWrapper.classList.add('error')
            // add error message
            const errorP = vehicleWrapper.querySelector('p.errors') as HTMLParagraphElement
            errorP.innerText = `Please select a Vehicle`
            return
        }
        // if (this.issue_count == 0 || this.issues.length == 0) {
        //     console.log('pass d')
        //     // add orange border
        //     const taskWrapper = form.querySelector('#addTask') as HTMLButtonElement
        //     taskWrapper.classList.add('bg-amber-300')
        //     // add error message
        //     const errorP = form.querySelector('p.qerrors') as HTMLParagraphElement
        //     errorP.innerText = `Please add at least 1 task`
        //     return
        // }

        console.log('Passed checks')

        // if no errors collect all the required data
        const vehicle: any = this.vehicleSelected.id
        const customer: any = this.customerSelected.id
        const date: any = this.jobcard.date
        const issues: string = this.getIssuesString(0)
        const diagnostics: string = this.getIssuesString(1)
        const jobcard_types = this.jobcard_types
        const conditions = this.conditions
        const checklist = this.checklist
        // create 1 object for the data
        const data_object = {
            'vehicle': vehicle,
            'customer': customer,
            'issues': issues,
            'diagnostics': diagnostics,
            'date': date,
            'jobcard_types': jobcard_types,
            'conditions': conditions,
            'checklist': checklist,
        }

        let response: any = ''
        if (this.update_state) {
            console.log('pass 2')
            response = await PUT(this.url, data_object)
        } else {
            console.log('pass 3')
            response = await POST(this.url, data_object)
        }
        if (response.status) {
            // Redirect to /jobcards/
            window.location.href = '/jobcards/';
        } else {
            alert(response.message)
        }
        this.load = false
        if (!this.update_state) {
            window.location.href = '/jobcards';
        }
    },
    getIssuesString(num = 0) {
        let str = ''
        if (num == 0) {
            this.issues.forEach((issue: Issue) => {
                str += issue.text + '\n'
            });
        }
        else if (num == 1) {
            this.diagnostics.forEach((issue: any) => {
                str += issue.text + '\n'
            });
        }
        return str
    },
    async handleCustomerSubmit(event: Event) {
        event.preventDefault()
        const urls = this.urls
        const response = await POST(urls.customers, this.customerEdit)
        if (response.status == 200) {
            this.add_customer_show = false
            this.pickerSelect(response.data, 0)
            this.customers.push(response.data)
        } else {
            alert(response.message)
        }
    },
    async handleVehicleSubmit(event: Event) {
        event.preventDefault()
        const urls = this.urls
        const response = await POST(urls.vehicles, this.vehicleEdit)
        if (response.status == 200) {
            this.add_vehicle_show = false
            this.pickerSelect(response.data, 1)
            this.vehicles.push(response.data)
        } else {
            alert(response.message)
        }
    },
    generateTasks(text: string, num = 0) {
        const tasks = text.split('\n')
        tasks.forEach(q => {
            if (q != '') {
                if (num == 0) {
                    const task = { 'text': q }
                    this.issues.push(task)
                } else if (num == 1) {
                    const task = { 'text': q }
                    this.diagnostics.push(task)
                }
            }
        });
    },
    selectType(type: any) {
        type.selected = !type.selected
    },
    selectCondition(condition: any) {
        condition.selected = !condition.selected
    },

    async overallInit(pk = false) {
        this.urls = (await apiURLS()).data
        let url: any = ''
        if (pk) {
            url = pk
        } else {
            url = this.urls.jobcard_backend
        }
        this.url = url
        const response = await GET(url)
        this.customers = response.data.customers
        this.customers_matched = response.data.customers
        this.vehicles = response.data.vehicles
        this.vehicles_matched = response.data.vehicles
        this.jobcard_types = response.data.jobcard_types
        this.conditions = response.data.conditions
        return response
    },
    async normalInit() {
        await this.overallInit(false)
        this.load = false
    },
    async updateInit(pk: number, url: string) {
        this.update_state = true
        const response = await this.overallInit(url)
        console.log(response)
        this.checklist = response.data.checklist
        this.jobcard = response.data.jobcard
        const urls = this.urls
        this.getObject(this.jobcard.customer, this.customers, 0)
        this.getObject(this.jobcard.vehicle, this.vehicles, 1)
        this.generateTasks(this.jobcard.customer_request, 0)
        this.generateTasks(this.jobcard.diagnostics, 1)

        response.data.customers.forEach((customer: any) => {
            if (customer.id == this.jobcard) {
                this.customerSelected = customer
            }
        });


        console.log(this.selected_jobcard_types);

        this.load = false
    },
    getObject(pk: number, obj: any[], num: number) {
        obj.forEach(element => {
            if (element.id == pk) {
                this.pickerSelect(element, num)
                // console.log(element)
            }
        });
    },
    setDefaults(objs: any, num: number) {
        objs.forEach((type: any) => {
            if (num == 0) {
                this.selectType(type)
            }
            else if (num == 1) {
                this.selectCondition(type)
            }
        });
    }
})