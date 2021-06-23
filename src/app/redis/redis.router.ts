import { ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class RedisRouter{

    private static urlBase = '/api/youwol-infra/redis'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(RedisRouter.webSocket$)
            return RedisRouter.webSocket$

        RedisRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/redis/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            RedisRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                RedisRouter.status$.next(d as Status) 
        };
        
        return RedisRouter.webSocket$
    }

    static watch(namespace: string) {

        RedisRouter.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            RedisRouter.triggerStatus(namespace)
        })
        
        return RedisRouter.status$.pipe(
            filter( (message: any) => message.namespace == namespace)
        )
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