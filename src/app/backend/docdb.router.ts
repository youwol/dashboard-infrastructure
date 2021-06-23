import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class DocDbRouter{

    private static urlBase = '/api/youwol-infra/docdb'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(DocDbRouter.webSocket$)
            return DocDbRouter.webSocket$

        DocDbRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/docdb/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            DocDbRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                DocDbRouter.status$.next(d as Status) 
        };
        
        DocDbRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            DocDbRouter.triggerStatus()
        })
        return DocDbRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${DocDbRouter.urlBase}/status`, { headers: DocDbRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${DocDbRouter.urlBase}/install`, { headers: DocDbRouter.headers })
        fetch(r).then()
    }
}