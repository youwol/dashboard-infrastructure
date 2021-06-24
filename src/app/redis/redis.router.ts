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


export class RedisRouter{

    private static urlBase = '/api/youwol-infra/redis'
    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    
    static connectWs(){
        return Backend.connectWs<Status>('redis', RedisRouter)
    }

    static watch(namespace: string): Observable<Status> {
        return Backend.watch(namespace, RedisRouter)
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${RedisRouter.urlBase}/${namespace}/status`, { headers: RedisRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${RedisRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: RedisRouter.headers })
        fetch(r).then()
    }
}