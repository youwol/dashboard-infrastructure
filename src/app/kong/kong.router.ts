import { Observable, ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { createObservableFromFetch } from "../backend/router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}

export interface ServiceResp{

    host: string
    port: number
    updatedAt: number,
    caCertificate: string | undefined
    name: string
    path: string | undefined
    clientCertificate: string | undefined
    tags: Array<string>
}

export interface ServicesResp{
    next: string | undefined
    data: Array<ServiceResp>
}

export interface RouteResp{

    name: string
    hosts: Array<string>
    paths: Array<string>
}

export interface RoutesResp{
    next: string | undefined
    data: Array<RouteResp>
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
        
        return KongRouter.webSocket$
    }

    static watch(namespace: string) {

        KongRouter.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            KongRouter.triggerStatus(namespace)
        })
        
        return KongRouter.status$.pipe(
            filter( (message: any) => message.namespace == namespace)
        )
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${KongRouter.urlBase}/${namespace}/status`, { headers: KongRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${KongRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: KongRouter.headers })
        fetch(r).then()
    }

    static kongAdminInfo$(namespace: string){
        
        let url = `${KongRouter.urlBase}/${namespace}/kong-admin/info`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request)
    }
    
    static kongAdminServices$(namespace: string): Observable<ServicesResp>{
        
        let url = `${KongRouter.urlBase}/${namespace}/kong-admin/services`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request) as Observable<ServicesResp>
    }

    static kongAdminRoutes$(namespace: string, service: string): Observable<RoutesResp>{
        
        let url = `${KongRouter.urlBase}/${namespace}/kong-admin/services/${service}/routes`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request) as Observable<RoutesResp>
    }
}