import { Observable, ReplaySubject } from "rxjs";
import { LogMessage } from "../logs-view";
import { EnvironmentRouter } from "./environment.router";
import { K8sDashboardRouter } from "./k8s-dashboard.router";
import { KongRouter } from "./kong.router";
import { LogsRouter } from "./logs.router";
import { MinioRouter } from "./minio.router";
import { PostgreSqlRouter } from "./postgre-sql.router";
import { ScyllaRouter } from "./scylla.router";
import { RedisRouter } from "./redis.router";

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
        LogsRouter.headers=headers,
        K8sDashboardRouter.headers=headers,
        PostgreSqlRouter.headers=headers,
        KongRouter.headers=headers,
        MinioRouter.headers=headers
        ScyllaRouter.headers=headers,
        RedisRouter.headers=headers
    }


    static environment = EnvironmentRouter
    static logs = LogsRouter
    static k8sDashboard = K8sDashboardRouter
    static postgreSql = PostgreSqlRouter
    static kong = KongRouter
    static minio = MinioRouter
    static scylla = ScyllaRouter
    static redis = RedisRouter
}
