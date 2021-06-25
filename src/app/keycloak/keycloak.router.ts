import { Observable, ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"
import { Backend } from "../backend/router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class KeycloakRouter{

    private static urlBase = '/api/youwol-infra/keycloak'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${KeycloakRouter.urlBase}/${namespace}/status`, { headers: KeycloakRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${KeycloakRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: KeycloakRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${KeycloakRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: KeycloakRouter.headers })
        fetch(r).then()
    }
}