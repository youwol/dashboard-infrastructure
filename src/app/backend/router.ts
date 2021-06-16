import { Observable, ReplaySubject } from "rxjs";
import { LogMessage } from "../logs-view";
import { EnvironmentRouter } from "./environment.router";
import { LogsRouter } from "./logs.router";

export function createObservableFromFetch( request, extractFct = (d) =>d ){

    return new Observable(observer => {
        fetch(request)
          .then(response => response.json()) // or text() or blob() etc.
          .then(data => {
            observer.next( extractFct(data));
            observer.complete();
          })
          .catch(err => observer.error(err)); 
    });
}

export class Backend {

    static urlBase = '/api/infra-backend'

    static headers : {[key:string]: string}= {}

    static setHeaders(headers: {[key:string]:string}){
        Backend.headers=headers
        EnvironmentRouter.headers=headers
        LogsRouter.headers=headers
    }


    static environment = EnvironmentRouter
    static logs = LogsRouter
}
