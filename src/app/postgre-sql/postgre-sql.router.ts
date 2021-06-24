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


export class PostgreSqlRouter{

    private static urlBase = '/api/youwol-infra/postgre-sql'
    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    static connectWs(){
        return Backend.connectWs<Status>('postgre-sql', PostgreSqlRouter)
    }

    static watch(namespace: string): Observable<Status> {
        return Backend.watch(namespace, PostgreSqlRouter)
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${PostgreSqlRouter.urlBase}/${namespace}/status`, { headers: PostgreSqlRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${PostgreSqlRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: PostgreSqlRouter.headers })
        fetch(r).then()
    }
}