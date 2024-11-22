import { GET } from "./global"

declare const logsUrl: string

export default ():any => ({
    load: true,
    show_logs: false,

    async get(url:string){
        const response = await GET(url)
    },
    init(){
        this.load = false
    }
})