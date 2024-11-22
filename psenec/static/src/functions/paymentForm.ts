import { Payment, Transaction } from "../classes/classes"
import { GET, POST, PUT, apiURLS } from "./global"


export default ():any => ({
    load: true,
    create: true,
    category_picker: false,
    categorySelected: false,
    account_picker: false,
    accountSelected: false,
    technician_picker: false,
    technicianSelected: false,
    jobcard_picker: false,
    jobcardSelected: false,
    payee_picker: false,
    payeeSelected: false,

    t_show: false,
    j_show: false,
    p_show: false,
    add_payee: false,

    categories: [],
    accounts: [],
    technicians: [],
    jobcards: [],
    payees: [],
    urls: [],
    new_payee: {'name':'','contact':''},

    account_select_open: null,

    payment: new Payment(),

    show_picker(index: number, transaction: Transaction | null = null) {
        if (index == 0) {
            // category form default
            this.category_picker = true
            let selector = 'category-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.category_picker = false
                }
            })
        }
        else if (index == 1 && transaction) {
            // account form default
            this.account_picker = transaction.count
            let selector = `account-input${transaction.count}`
            const input = document.getElementById(selector) as HTMLDivElement
            this.account_select_open = input
        }
        else if (index == 2) {
            // technician form default
            this.technician_picker = true
            let selector = 'technician-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.technician_picker = false
                }
            })
        }
        else if (index == 3) {
            // jobcard form default
            this.jobcard_picker = true
            let selector = 'jobcard-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.jobcard_picker = false
                }
            })
        }
        else if (index == 4) {
            // payee form default
            this.payee_picker = true
            let selector = 'payee-input'
            const input = document.getElementById(selector) as HTMLDivElement
            document.addEventListener('click', (event) => {
                if (!input.contains(event.target as HTMLElement)) {
                    this.payee_picker = false
                }
            })
        }
    },
    pickerSelect(object: any, index: number, transaction: Transaction | null = null) {
        if (index == 0) {
            this.categorySelected = object
            this.category_picker = false
            this.payment.category = object.id
        }
        else if (index == 1 && transaction) {
            transaction.accountSelected = object
            transaction.account = object.id
            this.account_picker = false
        }
        else if (index == 2) {
            this.technicianSelected = object
            this.technician_picker = false
            this.payment.technician = object.id
        }
        else if (index == 3) {
            this.jobcardSelected = object
            this.jobcard_picker = false
            this.payment.jobcard = object.id
            console.log(object)
        }
        else if (index == 4) {
            this.payeeSelected = object
            this.payee_picker = false
            this.payment.payee = object.id
            console.log(object)
        }
    },
    async savePayment() {
        const form = document.getElementById("idPaymentForm") as HTMLFormElement
        form.requestSubmit()
    },
    async submitForm(event: Event) {
        event.preventDefault()
        this.load = true
        if (this.create) {
            const response = await POST(this.urls.payments_backend, this.payment)
            console.log(response)
            if (response.data){
                window.location.assign('/payments/')
            }
        } else {
            const response = await PUT(`${this.urls.payments_backend}${this.payment.id}/`, this.payment)
            console.log(response)
        }
        this.load = false
    },
    addTransaction(transaction: Transaction | null = null) {
        console.log('add')
        if (transaction) {
            this.payment.addTransaction(false, transaction)
        } else {
            this.payment.addTransaction(false)
        }
    },
    removeTransaction(transaction: Transaction) {
        const left = this.payment.transactions.filter((value: Transaction) => {
            return value != transaction
        })
        this.payment.transactions = left
        if (transaction.id > 0) {
            this.payment.rem_transactions.push(transaction)
        }
    },
    async submitNewPayee(){
        if (this.new_payee.name == '') {
            alert('Name is required for payee')
            return
        }
        this.load = true
        const payee = await POST(this.urls.payees,this.new_payee)
        this.payeeSelected = payee.data
        this.payees = (await GET(this.urls.payees)).data
        this.add_payee = false
        this.payee_picker = false
        this.load = false
    },
    async init() {
        const urls = (await apiURLS()).data
        this.urls = urls

        
        this.payees = (await GET(urls.payees)).data
        this.jobcards = (await GET(urls.jobcardsopen)).data
        this.technicians = (await GET(urls.technicians)).data

        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('pk')

        
        
        if (!id) {
            // create
            const {data} = await GET(`${urls.payments_backend}`)
            this.categories = data.categories
            this.accounts = data.accounts
            const payment = new Payment()
            payment.addTransaction(false)
            this.payment = payment
        } else {
            this.create = false
            const {data} = await GET(`${urls.payments_backend}${id}/`)
            this.categories = data.categories
            this.accounts = data.accounts
            const p = data.payment
            const payment = new Payment(p.id, p.cleared_immediately, p.description, p.category, p.payee, p.technician, p.jobcard)
            payment.date_cleared = p.date_cleared

            p.transaction_objs.forEach((tran:Transaction) => {
                payment.addTransaction(false, tran)
            });
            
            this.categorySelected = this.categories.find(obj => obj.id == payment.category)
            if (p.payee.id) {
              this.payeeSelected = this.payees.find(obj => obj.id == p.payee.id)
            }
            if (p.technician.id) {
              this.technicianSelected = this.technicians.find(obj => obj.id == p.technician.id)
            }
            if (p.jobcard.id) {
              this.jobcardSelected = this.jobcards.find(obj => obj.id == p.jobcard.id)
            }
            this.payment = payment
            console.log(this.payment)
        }
        this.load = false
    }
})
