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
import { mergeMap, take } from "rxjs/operators";
import { instanceOfDeploymentStatus } from "../models";
import { CDNRouter } from "../cdn/cdn.router";

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
export function createTextObservableFromFetch( request, extractFct = (d) =>d ){

    return new Observable(observer => {
        fetch(request)
          .then(response => response.text()) // or text() or blob() etc.
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
        RedisRouter.headers=headers,
        CDNRouter.headers=headers
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
    static cdn = CDNRouter

    static connectWs<TStatus>(routePath: string, RouterType){

        if(RouterType.webSocket$)
            return RouterType.webSocket$

        RouterType.webSocket$ = new ReplaySubject()
        let socket_url = `ws://localhost:2260/${routePath}/ws`
        var ws = new WebSocket(socket_url);

        ws.onmessage = (event) => {
            let d = JSON.parse(event.data)
            RouterType.webSocket$.next(d)
            let ns = d.namespace
            if(ns && ! RouterType.statusDict$[ns]){
                RouterType.statusDict$[ns] = new ReplaySubject<TStatus>(1)
            }
            if(instanceOfDeploymentStatus(d)){
                RouterType.statusDict$[ns].next(d)
            }
        };
        
        return RouterType.webSocket$
    }


    static watch<TStatus>(namespace: string, RouterType) : ReplaySubject<TStatus> {

        RouterType.connectWs().pipe(
            take(1),
            mergeMap( () => EnvironmentRouter.environments$ )
        ).subscribe( () => {
            RouterType.triggerStatus(namespace)
        })
        if( ! RouterType.statusDict$[namespace]){
            RouterType.statusDict$[namespace] = new ReplaySubject<TStatus>(1)
        }
        return RouterType.statusDict$[namespace] 
    }
}
