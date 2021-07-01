import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class FluxRunnerRouter{

    private static urlBase = '/api/youwol-infra/flux-runner'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${FluxRunnerRouter.urlBase}/${namespace}/status`, { headers: FluxRunnerRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${FluxRunnerRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: FluxRunnerRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${FluxRunnerRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: FluxRunnerRouter.headers })
        fetch(r).then()
    }
}