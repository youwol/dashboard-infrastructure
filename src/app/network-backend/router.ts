import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class NetworkBackendRouter{

    private static urlBase = '/api/youwol-infra/network-backend'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${NetworkBackendRouter.urlBase}/${namespace}/status`, { headers: NetworkBackendRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${NetworkBackendRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: NetworkBackendRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${NetworkBackendRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: NetworkBackendRouter.headers })
        fetch(r).then()
    }
}