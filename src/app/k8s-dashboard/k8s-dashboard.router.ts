import { ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
    dashboardUrl: string
    accessToken: string
}


export class K8sDashboardRouter{

    private static urlBase = '/api/youwol-infra/k8s-dashboard'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(K8sDashboardRouter.webSocket$)
            return K8sDashboardRouter.webSocket$

        K8sDashboardRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/k8s-dashboard/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            K8sDashboardRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                K8sDashboardRouter.status$.next(d as Status) 
        };
        
        return K8sDashboardRouter.webSocket$
    }

    static watch(namespace: string) {

        K8sDashboardRouter.connectWs().pipe(
            take(1),
            mergeMap(() => EnvironmentRouter.environments$)
        ).subscribe(() => {
            K8sDashboardRouter.triggerStatus(namespace)
        })

        return K8sDashboardRouter.status$.pipe(
            filter((message: any) => message.namespace == namespace)
        )
    }
    
    static triggerStatus(namespace: string){
        let r = new Request( `${K8sDashboardRouter.urlBase}/${namespace}/status`, { headers: K8sDashboardRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body){

        let r = new Request( 
            `${K8sDashboardRouter.urlBase}/${namespace}/install`, 
            { method: 'POST', body: JSON.stringify(body), headers: K8sDashboardRouter.headers }
            )
        fetch(r).then()
    }
}