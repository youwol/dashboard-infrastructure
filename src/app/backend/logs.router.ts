import { combineLatest, Observable, ReplaySubject } from "rxjs"
import { map, take } from "rxjs/operators"
import { Environment, instanceOfEnvironment } from "../environment/models"
import { createObservableFromFetch } from "./router"

export class LogsRouter{

    private static urlBase = '/api/youwol-infra/logs'
    private static webSocket$ : ReplaySubject<any> 

    public static logs$ = new ReplaySubject<any>(1)
    static headers = {}

    static connectWs(){

        if(LogsRouter.webSocket$)
            return LogsRouter.webSocket$

            LogsRouter.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/logs/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            LogsRouter.webSocket$.next(d)
            console.log("Got log message", d)
            //if(instanceOfLog(d))
            LogsRouter.logs$.next(d) 
        };
        console.log("Logs Web socket connected!!")
        return LogsRouter.webSocket$
    }
}