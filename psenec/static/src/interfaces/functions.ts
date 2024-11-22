import { Checklist, Customer, Issue, JobCard, Vehicle } from "../classes/classes"

export interface jobCardForm {
    customers: []
    customers_matched: []
    vehicles: []
    vehicles_matched: []
    issues: []
    // states
    update_state: false
    add_customer_show: false
    add_vehicle_show: false
    customer_picker: false
    vehicle_picker: false
    load: true
    issue_count: 0
    // objects
    customerSelected: any
    vehicleSelected: any
    customerEdit: Customer
    vehicleEdit: Vehicle
    checklist: Checklist
    jobcard: JobCard
    // state methods
    closeForm(): any
    show_picker(index: number): any
    pickerSelect(object: Customer | Vehicle, index: number): any
    addTask(): any
    removeTask(task: Issue): any
    handleSearch(event: Event, num: number): any
    requestSubmit(): any
    handleFormSubmit(event: Event): any
    getIssuesString(): any
    saveChecklist(jobcard: JobCard): any
    handleCustomerSubmit(event: Event): any
    handleVehicleSubmit(event: Event): any
    generateTasks(text: string): any

    // CRUD functions ============
    getCustomers(): any
    getVehicles(): any
    apiroutes(): any

    normalInit(): any
    updateInit(jobcard: JobCard, url: string, checklist: Checklist): any
}