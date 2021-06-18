import { Observable, ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"
import { createObservableFromFetch } from "./router"


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

    static kongAdminInfo$(){
        
        let url = `${KongRouter.urlBase}/kong-admin/info`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request)
    }
    
    static kongAdminServices$(): Observable<ServicesResp>{
        
        let url = `${KongRouter.urlBase}/kong-admin/services`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request) as Observable<ServicesResp>
    }

    static kongAdminRoutes$(service: string): Observable<RoutesResp>{
        
        let url = `${KongRouter.urlBase}/kong-admin/services/${service}/routes`
        let request = new Request(url, { method: 'GET', headers: KongRouter.headers })
        return createObservableFromFetch(request) as Observable<RoutesResp>
    }
}