import { Model } from "../classes/classes";
import { GET, POST, PUT, apiURLS } from "./global";


export default (): any => ({
    load: true,
    tlist: false,
    change: false,

    jobcard: {},
    technicians: [],
    technician_selected: '',
    jcurl: '',
    tasks: [],
    tasks_to_delete: [],
    taskurl: '',

    quotation: { 'reference': '', 'issue_date': '', 'expiry_date': '', 'items': [] },
    qref: '',

    techSelect(technician: any) {
        this.jobcard.t_obj = technician
        this.technician_selected = technician
        console.log(this.jobcard.t_obj)
        this.jobcard.technician = technician.id
        console.log(this.jobcard.technician)
        this.tlist = false
        this.change = true
    },

    addItemToQuotation() {
        this.quotation.items.push({ 'name': '', 'quantity': '', 'price': '' })
    },
    deleteItemFromQuotation(item) {
        this.quotation.items = this.quotation.items.filter(itm => itm != item)
    },
    closeQuotation() {
        this.quotation = { 'reference': this.qref, 'issue_date': '', 'expiry_date': '', 'items': [] }
        this.addItemToQuotation()
    },
    grandTotal() {
        let total = 0
        this.quotation.items.forEach(item => {
            total += parseInt(item.price.replace(/,/g, ''))
        });
        return total
    },

    async detailInit(url: any, ref) {
        const response = await GET(url)
        if (response.status == 500) {
            alert(response.message)
        }
        const { data } = response
        console.log(data)
        this.qref = ref
        this.jcurl = data.url
        this.jobcard = data.jobcard
        this.technician_selected = data.technician_selected
        // get technicians
        this.technicians = data.technicians
        this.tasks = data.tasks
        this.taskurl = data.tasksurl
        // set t_obj
        if (this.jobcard.technician) {
            const arr = this.technicians.filter((value: Model) => {
                return value.id == this.jobcard.technician
            })
            // this.jobcard.t_obj = arr[0]
            // this.jobcard.technician = arr[0].id
        } else {
            // this.jobcard.t_obj = null
        }
        window.addEventListener('beforeunload', (event: BeforeUnloadEvent) => {
            if (this.change) {
                // Display a confirmation dialog
                const userConfirmed = window.confirm("You have unsaved changes. Do you want to leave without saving?");

                if (!userConfirmed) {
                    // If the user chooses not to leave, prevent the default behavior
                    event.preventDefault();
                    // For modern browsers
                    delete event.returnValue;
                }
            }
        });
        this.closeQuotation()
        this.load = false
    },
    async save() {
        this.load = true
        const response = await PUT(this.jcurl, this.jobcard)
        if (response.data) {
            this.load = false
            this.change = false
        }
    },
    async close() {
        this.load = true
        this.jobcard.is_open = !this.jobcard.is_open
        const response = await PUT(this.jcurl, this.jobcard)
        if (response.data) {
            this.load = false
            this.change = false
        }
    },
    addTask() {
        const q = { 'id': 0, 'description': '', 'is_done': true }
        this.tasks.push(q)
    },
    deleteTask(task) {
        this.tasks = this.tasks.filter(item => item != task)
        this.tasks_to_delete.push(task)
    },
    async saveTasks(event) {
        event.preventDefault()
        this.load = true
        let obj = {
            'tasks': this.tasks,
            'tasks_to_delete': this.tasks_to_delete
        }
        console.log(obj)
        const response = await POST(this.taskurl, obj)
        if (response.status) {
            this.load = false
        } else {
            alert(response.message)
            this.load = false
        }
    },
    getUserById(id: number): any {
        let technician = this.technicians.find((obj) => obj.id === id)
        if (!technician) {
            technician = { "id": null, "name": '' }
        }
        return technician;
    },
})