import { Receipt, Transaction } from "../classes/classes"
import { GET, POST, PUT, apiURLS } from "./global"

export default (): any => ({
    issueReceipt: false,
    account_picker: false,
    load: true,
    useNormalPayment: true,

    over_payment: 0,

    pk: 0,
    invoice: null,

    urls: {},
    edit_receipt: new Receipt(),
    accounts: [],
    receipts: [],

    addTransaction(transaction: Transaction | null = null) {
        if (transaction) {
            this.edit_receipt.addTransaction(true, transaction)
        } else {
            this.edit_receipt.addTransaction(true)
        }
    },
    removeTransaction(transaction: Transaction) {
        const left = this.edit_receipt.transaction_objects.filter((value: Transaction) => {
            return value != transaction
        })
        this.edit_receipt.transaction_objects = left
        if (transaction.id && transaction.id > 0) {
            this.edit_receipt.rem_transaction_objects.push(transaction)
        }
    },
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
    issue_receipt(receipt: Receipt | null = null) {
        if (receipt) {
            this.edit_receipt = receipt
        }
        else {
            this.edit_receipt = new Receipt()
            this.edit_receipt.addTransaction(true)
        }
        this.issueReceipt = true
    },

    toggleUseNormalPayment() {
        this.useNormalPayment = !this.useNormalPayment
        this.edit_receipt = new Receipt()
    },

    async handleSubmit(event: Event) {
        event.preventDefault()
        this.load = true
        const receipt = this.edit_receipt as Receipt
        if (receipt.trans_count < 1 && !receipt.virtual_amount ) {
            alert('Please add at least one transaction!')
            return
        }

        receipt.transaction_objects.forEach(transaction => {
            if (!transaction.account) {
                alert('Ensure that all transaction have an account selected')
                return
            }
        });

        if (receipt.id == 0) {
            let response = await POST(`${this.urls.receipts_backend}?pk=${this.pk}`, receipt)
        }
        else {
            let response = await PUT(`${this.urls.receipts_backend}?pk=${this.pk}`, receipt)
        }
        const { data } = await GET(`${this.urls.receipts_backend}?pk=${this.pk}`)
        this.receipts = []
        data.receipts.forEach((receipt: Receipt) => {
            const rc = new Receipt(receipt)
            this.receipts.push(rc)
        });
        this.load = false
        this.issueReceipt = false
    },

    amountCleared() {
        let total = 0
        this.receipts.forEach(receipt => {
            total += parseInt(receipt.amount)
        });
        if (total > this.invoice.total) {
            this.over_payment = total - this.invoice.total
            return this.invoice.total
        }
        return total
    },


    async initialize(invoice, accounts, receipts) {
        const urls = (await apiURLS()).data
        this.urls = urls
        this.pk = invoice.pk
        this.invoice = invoice

        receipts.forEach((receipt: Receipt) => {
            const rc = new Receipt(receipt)
            rc.virtual_transaction = receipt.virtual_transaction
            this.receipts.push(rc)
        });
        this.accounts = accounts
        this.load = false
    }
})