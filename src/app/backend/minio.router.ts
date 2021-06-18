import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"
import { createObservableFromFetch } from "./router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
    url: string
    accessKey: string
    secretKey: string
}


export class MinioRouter{

    private static urlBase = '/api/youwol-infra/minio'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(MinioRouter.webSocket$)
            return MinioRouter.webSocket$

        MinioRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/minio/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            MinioRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                MinioRouter.status$.next(d as Status) 
        };
        
        MinioRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            MinioRouter.triggerStatus()
        })
        return MinioRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${MinioRouter.urlBase}/status`, { headers: MinioRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${MinioRouter.urlBase}/install`, { headers: MinioRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(){
        let r = new Request( `${MinioRouter.urlBase}/upgrade`, { headers: MinioRouter.headers })
        fetch(r).then()
    }
}