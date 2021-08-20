import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class NetworkRouter{

    private static urlBase = '/api/youwol-infra/network'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${NetworkRouter.urlBase}/${namespace}/status`, { headers: NetworkRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${NetworkRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: NetworkRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${NetworkRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: NetworkRouter.headers })
        fetch(r).then()
    }
}