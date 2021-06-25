import { Observable, ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { Backend } from "../backend/router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class StorageRouter{

    private static urlBase = '/api/youwol-infra/storage'
    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static triggerStatus(namespace: string){

        let r = new Request( `${StorageRouter.urlBase}/${namespace}/status`, { headers: StorageRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${StorageRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: StorageRouter.headers })
        fetch(r).then()
    }
}