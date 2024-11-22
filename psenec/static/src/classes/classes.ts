import { GET, apiURLS } from "../functions/global"
import { currentDate } from "../functions/input_fields"

export class Customer {
    id: number | null | string
    name: string | null
    email: string | null
    contact_1: string | null
    contact_2: string | null
    address: string | null
    constructor(name: string | null = null, email: string | null = null, contact_1: string | null = null, contact_2: string | null = '', address: string | null = '', id: number | null | string = null) {
        this.id = id
        this.name = name
        this.email = email
        this.contact_1 = contact_1
        this.contact_2 = contact_2
        this.address = address
    }
    data(object: Customer) {
        this.id = object.id
        this.name = object.name
        this.email = object.email
        this.contact_1 = object.contact_1
        this.contact_2 = object.contact_2
        this.address = object.address
    }
}

export class Vehicle {
    id: number | null | string
    plate_number: string | null
    engine_number: string | null
    chasis_number: string | null
    make: string | null
    model: string | null
    year: number | null
    constructor(plate_number: string | null = null, engine_number: string | null = null, chasis_number: string | null = null, make: string | null = '', model: string | null = '', year: string | null = '', id: string | null = null) {
        this.plate_number = plate_number
        this.chasis_number = chasis_number
        this.engine_number = engine_number
        this.make = make
        this.model = model
        if (year == '') {
            this.year = null
        } else {
            try {
                this.year = Number(year)
            } catch (error) {
                this.year = null
            }
        }
        this.id = id
    }
    data(object: Vehicle) {
        this.id = object.id
        this.plate_number = object.plate_number
        this.chasis_number = object.chasis_number
        this.engine_number = object.engine_number
        this.make = object.make
        this.model = object.model
        this.year = object.year
    }
}

export class Checklist {
    id: number | null
    body: boolean
    glasses: boolean
    sidemirrors: boolean
    tyres: boolean
    wheelcaps: boolean
    sparetyre: boolean
    horn: boolean
    reverse_buzzer: boolean
    headlights_low: boolean
    headlights_high: boolean
    indicators_lights: boolean
    hazard_lights: boolean
    reverse_lights: boolean
    license_lights: boolean
    brake_lights: boolean
    interior_lights: boolean
    mileage: string | null | number
    personal_items: string | null
    comments: string | null
    jobcard: number | null
    engine_oil:number | null
    brake_fluid:number | null
    windscreen_washer:number | null
    constructor(
        body = true,
        glasses = true,
        sidemirrors = true,
        tyres = true,
        wheelcaps = true,
        sparetyre = true,
        horn = true,
        reverse_buzzer = true,
        headlights_low = true,
        headlights_high = true,
        indicators_lights = true,
        hazard_lights = true,
        reverse_lights = true,
        license_lights = true,
        brake_lights = true,
        interior_lights = true,
        mileage = null,
        personal_items = null,
        comments = null,
        jobcard = null,
        id = null
    ) {
        this.body = body
        this.glasses = glasses
        this.sidemirrors = sidemirrors
        this.tyres = tyres
        this.wheelcaps = wheelcaps
        this.sparetyre = sparetyre
        this.horn = horn
        this.reverse_buzzer = reverse_buzzer
        this.headlights_low = headlights_low
        this.headlights_high = headlights_high
        this.indicators_lights = indicators_lights
        this.hazard_lights = hazard_lights
        this.reverse_lights = reverse_lights
        this.license_lights = license_lights
        this.brake_lights = brake_lights
        this.interior_lights = interior_lights
        this.mileage = mileage
        this.personal_items = personal_items
        this.comments = comments
        this.jobcard = jobcard
        this.id = id
        this.engine_oil = null
        this.brake_fluid = null
        this.windscreen_washer = null
    }
    fromObject(form: HTMLFormElement) {
        this.body = form['body']
        this.glasses = form['glasses']
        this.sidemirrors = form['sidemirrors']
        this.tyres = form['tyres']
        this.wheelcaps = form['wheelcaps']
        this.sparetyre = form['sparetyre']
        this.horn = form['horn']
        this.reverse_buzzer = form['reverse_buzzer']
        this.headlights_low = form['headlights_low']
        this.headlights_high = form['headlights_high']
        this.indicators_lights = form['indicators_lights']
        this.hazard_lights = form['hazard_lights']
        this.reverse_lights = form['reverse_lights']
        this.license_lights = form['license_lights']
        this.brake_lights = form['brake_lights']
        this.interior_lights = form['interior_lights']
        this.mileage = form['mileage']
        this.personal_items = form['personal_items']
        this.comments = form['comments']
    }
}

export class JobCard {
    id: number | null
    vehicle: number | null
    customer: number | null
    customer_request: string 
    plate_number: string | null
    diagnostics: string 
    date: string 

    constructor(vehicle: null | number = null, customer: null | number = null, customer_request: string = '', date='', id: null | number = null) {
        this.vehicle = vehicle
        this.customer = customer
        this.customer_request = customer_request
        this.id = id
        this.plate_number = null
        this.diagnostics = ''
        this.date = date
        if (vehicle) {
            this.getPlates()
        }
    }

    async getPlates() {
        if (this.vehicle && !this.plate_number) {
            const urls = await apiURLS()
            let vehicle = await GET(`${urls.data.vehicles}${this.vehicle}/`)
            this.plate_number = vehicle.data.plate_number
            return this.plate_number
        }
        else {
            return this.plate_number
        }
    }
}

export class Issue {
    text: string
    count: number
    constructor(count: number, text = '') {
        this.count = count
        this.text = text
    }
}

export interface JSONObject {
    forEach(a: Function): void
    status: number
    data: JSONObject | any
    message: string
    jobcard: JobCard
}

export class Quotation {
    id: number | null
    jobcard: number | null
    contact: number | null
    issue_date: Date | string | null
    expiry_date: Date | string | null
    reference: string | null
    currency: string | null
    constructor(
        jobcard: number | null = null,
        contact: number | null = null,
        issue_date: string | null = null,
        expiry_date: string | null = null,
        reference: string | null = '',
        id: number | null = null,
        currency: string | null = 'Ugandan Shilling',
    ) {
        this.jobcard = jobcard
        this.contact = contact
        this.reference = reference
        this.currency = currency
        this.id = id
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        let date = new Date();
        if (issue_date) {
            date = new Date(issue_date);
        }
        let day = date.getDate().toString().padStart(2, '0');
        let month = monthNames[date.getMonth()];
        let year = date.getFullYear().toString();
        let currentDate = `${day} . ${month} . ${year}`;
        this.issue_date = currentDate
        if (expiry_date) {
            date = new Date(expiry_date)
        } else {
            date = new Date()
            date.setDate(date.getDate() + 14)
        }
        day = date.getDate().toString().padStart(2, '0');
        month = monthNames[date.getMonth()];
        year = date.getFullYear().toString();
        currentDate = `${day} . ${month} . ${year}`;
        this.expiry_date = currentDate
    }
}

export class Item {
    quotation: number | null
    name: string | null
    description: string | null
    quantity: number
    price: number | null
    id: number | null
    constructor(
        name: string | null = null,
        description: string | null = null,
        quantity: number = 1,
        price: number | null = null,
        quotation: number | null = null,
        id: number | null = null,
    ) {
        this.quotation = quotation
        this.name = name
        this.description = description
        this.quantity = quantity
        this.price = price
        this.id = id
    }

    ammount() {
        if (this.price) {
            return this.price * this.quantity
        }
    }
}

export class Invoice {
    id: number | null
    jobcard: number | null
    contact: number | null
    issue_date: Date | string | null
    expiry_date: Date | string | null
    reference: string | null
    currency: string
    unselected_items: Item[]
    items: Item[]
    vat: boolean
    constructor(
        jobcard: number | null = null,
        contact: number | null = null,
        issue_date = currentDate(),
        expiry_date = currentDate(),
        reference: string | null = '',
        id: number | null = null,
        currency: string = 'Ugandan Shilling',
    ) {
        this.jobcard = jobcard
        this.contact = contact
        this.reference = reference
        this.currency = currency
        this.id = id
        this.issue_date = issue_date
        this.expiry_date = expiry_date
        this.unselected_items = []
        this.items = []
        this.vat = false
    }
}

export interface Model {
    id: number
}

export class Payment {
    id: number
    cleared_immediately: boolean
    date_cleared: string
    description: string
    category: number
    payee: number
    technician: number
    jobcard: number
    transactions: object[]
    rem_transactions: object[]
    trans_count: number
    constructor(id = 0, cleared_immediately = true, description = '', category = null, payee = null, technician = null, jobcard = null, transactions = []) {
        this.id = Number(id)
        this.cleared_immediately = cleared_immediately
        this.description = description
        this.category = Number(category)
        this.payee = Number(payee)
        this.technician = Number(technician)
        this.jobcard = Number(jobcard)
        this.transactions = transactions
        this.rem_transactions = []
        this.trans_count = 0
        this.date_cleared = ''
    }
    addTransaction(type: boolean, transaction: Transaction | null = null) {
        const trans = new Transaction(type)
        trans.count = this.trans_count
        this.trans_count++
        if (transaction != null) {
            trans.fromObject(transaction)
        }
        this.transactions.push(trans)
    }
}

export class Income {
    id: number
    description: string
    transactions: object[]
    rem_transactions: object[]
    trans_count: number
    date: string
    new_date: string
    constructor(id = 0, description = '', transactions = []) {
        this.id = Number(id)
        this.description = description
        this.transactions = transactions
        this.rem_transactions = []
        this.trans_count = 0
        this.date = ''
    }
    addTransaction(type: boolean, transaction: Transaction | null = null) {
        const trans = new Transaction(type)
        trans.count = this.trans_count
        this.trans_count++
        if (transaction != null) {
            trans.fromObject(transaction)
        }
        this.transactions.push(trans)
    }
}

export class Transaction {
    id: number
    amount: number | null
    account: number | null
    charges: number | null
    trans_id: string | null
    is_deposit: boolean
    description: string | null
    accountSelected: Model | null | string
    count: number
    constructor(is_deposit: boolean) {
        this.id = 0
        this.amount = null
        this.account = null
        this.is_deposit = is_deposit
        this.description = ''
        this.accountSelected = ''
        this.charges = 0
        this.trans_id = null
        this.count = 0
    }
    fromObject(object: Transaction) {
        this.id = object.id
        this.amount = object.amount
        this.account = object.account
        this.is_deposit = object.is_deposit
        this.description = object.description
        this.accountSelected = object.accountSelected
        this.charges = object.charges
        this.trans_id = object.trans_id
    }
}

export class Receipt {
    id: number
    invoice: number
    date_issued: string
    transactions: number[]
    transaction_objects: Transaction[]
    rem_transaction_objects: Transaction[]
    trans_count: number
    amount: number
    virtual_amount: number
    virtual_transaction: boolean

    constructor(obj: Receipt | null = null) {
        if (obj) {
            this.id = obj.id
            this.invoice = obj.invoice
            this.date_issued = obj.date_issued
            this.transactions = obj.transactions
            this.amount = obj.amount
            
            this.transaction_objects = []
            this.rem_transaction_objects = []
            this.trans_count = 0
            this.virtual_transaction = false

            obj.transaction_objects.forEach(t => {
                this.addTransaction(true, t)
            });
        }
        else {
            this.id = 0
            this.invoice = 0
            this.date_issued = currentDate()
            this.transactions = []
            this.transaction_objects = []
            this.rem_transaction_objects = []
            this.trans_count = 0
            this.amount = 0
            this.virtual_amount = 0
            this.virtual_transaction = false
        }
    }

    addTransaction(type: boolean, transaction: Transaction | null = null) {
        const trans = new Transaction(type)
        trans.count = this.trans_count
        this.trans_count++
        if (transaction != null) {
            trans.fromObject(transaction)
        }
        this.transaction_objects.push(trans)
    }
}
