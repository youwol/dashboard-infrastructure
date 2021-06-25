import { Observable, ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"
import { Backend } from "../backend/router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class CDNRouter{

    private static urlBase = '/api/youwol-infra/cdn'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${CDNRouter.urlBase}/${namespace}/status`, { headers: CDNRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${CDNRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: CDNRouter.headers })
        fetch(r).then()
    }
}