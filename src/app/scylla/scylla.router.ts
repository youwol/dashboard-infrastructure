import { ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class ScyllaRouter{

    private static urlBase = '/api/youwol-infra/scylla'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(ScyllaRouter.webSocket$)
            return ScyllaRouter.webSocket$

        ScyllaRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/scylla/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            ScyllaRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                ScyllaRouter.status$.next(d as Status) 
        };
        
        return ScyllaRouter.webSocket$
    }

    static watch(namespace: string) {

        ScyllaRouter.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            ScyllaRouter.triggerStatus(namespace)
        })
        
        return ScyllaRouter.status$.pipe(
            filter( (message: any) => message.namespace == namespace)
        )
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/status`, { headers: ScyllaRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: ScyllaRouter.headers })
        fetch(r).then()
    }
}