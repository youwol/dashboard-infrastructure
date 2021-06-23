import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"


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
        
        RedisRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            RedisRouter.triggerStatus()
        })
        return RedisRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${RedisRouter.urlBase}/status`, { headers: RedisRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${RedisRouter.urlBase}/install`, { headers: RedisRouter.headers })
        fetch(r).then()
    }
}