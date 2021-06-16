import { ReplaySubject } from "rxjs"
import { mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "./environment.router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class PostgreSqlRouter{

    private static urlBase = '/api/youwol-infra/postgre-sql'
    private static webSocket$ : ReplaySubject<any> 

    public static status$ = new ReplaySubject<Status>(1)
    
    static headers = {}

    static connectWs(){

        if(PostgreSqlRouter.webSocket$)
            return PostgreSqlRouter.webSocket$

        PostgreSqlRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/postgre-sql/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            PostgreSqlRouter.webSocket$.next(d)
            if(instanceOfDeploymentStatus(d))
                PostgreSqlRouter.status$.next(d as Status) 
        };
        
        PostgreSqlRouter.webSocket$.pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$)
        ).subscribe( () => {
            PostgreSqlRouter.triggerStatus()
        })
        return PostgreSqlRouter.webSocket$
    }

    static triggerStatus(){
        let r = new Request( `${PostgreSqlRouter.urlBase}/status`, { headers: PostgreSqlRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(){
        let r = new Request( `${PostgreSqlRouter.urlBase}/install`, { headers: PostgreSqlRouter.headers })
        fetch(r).then()
    }
}