import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class AssetsGatewayRouter{

    private static urlBase = '/api/youwol-infra/assets-gateway'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${AssetsGatewayRouter.urlBase}/${namespace}/status`, { headers: AssetsGatewayRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${AssetsGatewayRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: AssetsGatewayRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${AssetsGatewayRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: AssetsGatewayRouter.headers })
        fetch(r).then()
    }
}