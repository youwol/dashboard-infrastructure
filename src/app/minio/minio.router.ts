import { ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { createObservableFromFetch } from "../backend/router"


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
        
        return MinioRouter.webSocket$
    }

    static watch(namespace: string) {

        MinioRouter.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            MinioRouter.triggerStatus(namespace)
        })
        
        return MinioRouter.status$.pipe(
            filter( (message: any) => message.namespace == namespace)
        )
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${MinioRouter.urlBase}/${namespace}/status`, { headers: MinioRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${MinioRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: MinioRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body){
        let r = new Request( `${MinioRouter.urlBase}/${namespace}/upgrade`,
        { method: 'POST', body: JSON.stringify(body), headers: MinioRouter.headers })
        fetch(r).then()
    }
}