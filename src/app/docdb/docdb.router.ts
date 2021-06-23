import { ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"


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
        
        return DocDbRouter.webSocket$
    }

    static watch(namespace: string) {

        DocDbRouter.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            DocDbRouter.triggerStatus(namespace)
        })
        
        return DocDbRouter.status$.pipe(
            filter( (message: any) => message.namespace == namespace)
        )
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