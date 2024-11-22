interface Ijobcard {
    load: any
    tlist: any
    change: any
    jobcard: any
    technicians: any
    tasks: any[],
    tasks_to_delete: any[],
    technician_selected: any
    quotation: any
    qref: any
    jcurl: any
    taskurl: any
    techSelect(technician: any): any
    detailInit(url: any, ref: string): any
    save(): any
    closeQuotation(): any
    addItemToQuotation(): any
    deleteItemFromQuotation(item: any): any
    grandTotal(item: any): any
    close(): any
    addTask(): any
    deleteTask(task: any): any
    saveTasks(event: Event): any
    getUserById(id: number): any
}