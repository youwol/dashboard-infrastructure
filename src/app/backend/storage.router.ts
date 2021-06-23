import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class StorageRouter{

    private static urlBase = '/api/youwol-infra/storage'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(StorageRouter.webSocket$)
            return StorageRouter.webSocket$

        StorageRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/storage/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            StorageRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                StorageRouter.status$.next(d as Status) 
        };
        
        StorageRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            StorageRouter.triggerStatus()
        })
        return StorageRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${StorageRouter.urlBase}/status`, { headers: StorageRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${StorageRouter.urlBase}/install`, { headers: StorageRouter.headers })
        fetch(r).then()
    }
}