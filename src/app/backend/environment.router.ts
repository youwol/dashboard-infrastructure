import { combineLatest, Observable, ReplaySubject } from "rxjs"
import { map, take } from "rxjs/operators"
import { Environment, instanceOfEnvironment } from "../environment/models"
import { createObservableFromFetch } from "./router"

export class EnvironmentRouter{

    private static urlBase = '/api/youwol-infra/environment'
    private static webSocket$ : ReplaySubject<any> 

    public static environments$ = new ReplaySubject<Environment>(1)
    public static logs$ = new ReplaySubject<Environment>(1)
    static headers = {}

    static connectWs(){

        if(EnvironmentRouter.webSocket$)
            return EnvironmentRouter.webSocket$

        EnvironmentRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/environment/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            EnvironmentRouter.webSocket$.next(d)
            if(instanceOfEnvironment(d))
                EnvironmentRouter.environments$.next(d) 
        };
        
        return EnvironmentRouter.webSocket$
    }

    static folderContent$(path: Array<string>)
     :  Observable<{configurations: string[], folders: string[], files: string[]}>{

        let url = `${EnvironmentRouter.urlBase}/folder-content`
        let body = {path}
        let request = new Request(url, { method: 'POST', body: JSON.stringify(body), headers: EnvironmentRouter.headers })
        return createObservableFromFetch(request) as Observable<{configurations: string[], folders: string[], files: string[]}>
    } 

    static switchConfiguration$(body){

        let url = `${EnvironmentRouter.urlBase}/switch-configuration`
        let request = new Request(url, { method: 'POST', body: JSON.stringify(body), headers: EnvironmentRouter.headers })
        return createObservableFromFetch(request)
    }

    static selectContext$(body) {
        console.log("selectContext$")
        return new Observable()
    }
}