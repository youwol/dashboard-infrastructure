import { Observable, ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { Backend, createObservableFromFetch } from "../backend/router"


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

    static triggerStatus(namespace: string){

        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/status`, { headers: DocDbRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: DocDbRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body ){

        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/upgrade`, 
        { method: 'POST', body: JSON.stringify(body), headers: DocDbRouter.headers })
        fetch(r).then()
    }

    static getKeyspaces$(namespace: string): Observable<any>{
        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/keyspaces`, { headers: DocDbRouter.headers })
        return createObservableFromFetch(r) as Observable<any>
    }

    static getTables$(namespace: string, keyspace: string): Observable<any>{
        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/keyspaces/${keyspace}/tables`, { headers: DocDbRouter.headers })
        return createObservableFromFetch(r) as Observable<any>
    }

    static queryTable$(namespace: string, keyspace: string,  table: string, body): Observable<any>{
        let r = new Request( `${DocDbRouter.urlBase}/${namespace}/keyspaces/${keyspace}/tables/${table}/query`, 
        { headers: DocDbRouter.headers, method:'POST', body: JSON.stringify(body) })
        return createObservableFromFetch(r) as Observable<any>
    }
}