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


export class DocDbRouter{

    private static urlBase = '/api/youwol-infra/docdb'

    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static connectWs(){
        return Backend.connectWs<Status>('docdb', DocDbRouter)
    }

    static watch(namespace: string): Observable<Status> {
        return Backend.watch(namespace, DocDbRouter)
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/status`, { headers: DocDbRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: DocDbRouter.headers })
        fetch(r).then()
    }
}