import { Income, Payment, Transaction } from "../classes/classes"
import { GET, POST, PUT, apiURLS } from "./global"


export default ():any => ({
    load: true,
    create: true,

    account_picker: false,
    accountSelected: false,

    t_show: false,
    j_show: false,
    p_show: false,
    add_payee: false,

    accounts: [],
    urls: [],

    account_select_open: null,

    income: new Income,

    show_picker(index: number, transaction: Transaction | null = null) {
        if (index == 1 && transaction) {
            // account form default
            this.account_picker = transaction.count
            let selector = `account-input${transaction.count}`
            const input = document.getElementById(selector) as HTMLDivElement
            this.account_select_open = input
        }
    },
    pickerSelect(object: any, index: number, transaction: Transaction | null = null) {
        if (index == 1 && transaction) {
            transaction.accountSelected = object
            transaction.account = object.id
            this.account_picker = false
        }
    },
    
    async saveIncome() {
        const form = document.getElementById("idIncomeForm") as HTMLFormElement
        form.requestSubmit()
    },
    async submitForm(event: Event) {
        event.preventDefault()
        this.load = true
        if (this.create) {
            const response = await POST(this.urls.income_backend, this.income)
            console.log(response)
            if (response.data){
                window.location.assign('/income/')
            }
        } else {
            const response = await PUT(`${this.urls.income_backend}${this.income.id}/`, this.income)
            console.log(response)
        }
        this.load = false
    },
    addTransaction(transaction: Transaction | null = null) {
        if (transaction) {
            this.income.addTransaction(true, transaction)
        } else {
            this.income.addTransaction(true)
        }
    },
    removeTransaction(transaction: Transaction) {
        const left = this.income.transactions.filter((value: any) => {
            return value != transaction
        })
        this.income.transactions = left
        if (transaction.id > 0) {
            this.income.rem_transactions.push(transaction)
        }
    },
    async init() {
        const urls = (await apiURLS()).data
        this.urls = urls
        
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('pk')
        
        if (!id) {
            // create
            const {data} = await GET(`${urls.income_backend}`)
            this.accounts = data.accounts
            const income = new Income()
            income.addTransaction(true)
            this.income = income
        } else {
            this.create = false
            const {data} = await GET(`${urls.income_backend}${id}/`)
            this.accounts = data.accounts
            const income = data.income
            console.log(data)
            const income_obj = new Income(income.id, income.description)
            income_obj.date = income.date
            income_obj.new_date = income.new_date

            income.transaction_objs.forEach((tran:Transaction) => {
                income_obj.addTransaction(false, tran)
            });

            this.income = income_obj
            console.log(this.income)
        }
        this.load = false
    }
})
