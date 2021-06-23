import { Observable, ReplaySubject } from "rxjs";
import { LogMessage } from "../logs-view";
import { DocDbRouter } from "../docdb/docdb.router";
import { EnvironmentRouter } from "../environment/environment.router";
import { K8sDashboardRouter } from "../k8s-dashboard/k8s-dashboard.router";
import { KongRouter } from "../kong/kong.router";
import { LogsRouter } from "./logs.router";
import { MinioRouter } from "../minio/minio.router";
import { PostgreSqlRouter } from "../postgre-sql/postgre-sql.router";
import { ScyllaRouter } from "../scylla/scylla.router";
import { StorageRouter } from "../storage/storage.router";
import { RedisRouter } from "../redis/redis.router";

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
        MinioRouter.headers=headers,
        ScyllaRouter.headers=headers,
        DocDbRouter.headers=headers,
        StorageRouter.headers=headers,
        RedisRouter.headers=headers
    }


    static environment = EnvironmentRouter
    static logs = LogsRouter
    static k8sDashboard = K8sDashboardRouter
    static postgreSql = PostgreSqlRouter
    static kong = KongRouter
    static minio = MinioRouter
    static scylla = ScyllaRouter
    static docdb = DocDbRouter
    static storage = StorageRouter
    static redis = RedisRouter
}
