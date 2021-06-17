import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class KongRouter{

    private static urlBase = '/api/youwol-infra/kong'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(KongRouter.webSocket$)
            return KongRouter.webSocket$

        KongRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/kong/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            KongRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                KongRouter.status$.next(d as Status) 
        };
        
        KongRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            KongRouter.triggerStatus()
        })
        return KongRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${KongRouter.urlBase}/status`, { headers: KongRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${KongRouter.urlBase}/install`, { headers: KongRouter.headers })
        fetch(r).then()
    }
}