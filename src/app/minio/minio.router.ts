import { Observable, ReplaySubject } from "rxjs"
import { filter, mergeMap, take, tap } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { Backend, createObservableFromFetch } from "../backend/router"


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
    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}

    static headers = {}

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