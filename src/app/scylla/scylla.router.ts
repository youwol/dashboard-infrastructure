import { Observable, ReplaySubject } from "rxjs"
import { filter, mergeMap, take } from "rxjs/operators"
import { instanceOfDeploymentStatus, SanityEnum } from "../models"
import { EnvironmentRouter } from "../environment/environment.router"
import { Backend, createObservableFromFetch } from "../backend/router"


export interface Status{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
    cqlshUrl: string
}

export interface ScyllaKeyspace{

    name: string
    durableWrites: boolean
    replication: {
        class: string,
        replication_factor:number
    }
}

export interface ScyllaKeyspaces{

    keyspaces: Array<ScyllaKeyspace>
}


export interface ScyllaTable{

    keyspaceName: string
    tableName: string
}

export interface ScyllaTables{

    tables: Array<ScyllaTable>
}

export class ScyllaRouter{

    private static urlBase = '/api/youwol-infra/scylla'
    public static webSocket$ : ReplaySubject<any> 
    public static statusDict$ : {[key:string]: ReplaySubject<Status>} = {}
    
    static headers = {}

    
    static connectWs(){
        return Backend.connectWs<Status>('scylla', ScyllaRouter)
    }

    static watch(namespace: string): Observable<Status> {
        return Backend.watch(namespace, ScyllaRouter)
    }

    static triggerStatus(namespace: string){

        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/status`, { headers: ScyllaRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body ){

        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/install`, 
        { method: 'POST', body: JSON.stringify(body), headers: ScyllaRouter.headers })
        fetch(r).then()
    }

    static getKeyspaces$(namespace: string): Observable<ScyllaKeyspaces>{
        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/keyspaces`, { headers: ScyllaRouter.headers })
        return createObservableFromFetch(r) as Observable<ScyllaKeyspaces>
    }

    static getTables$(namespace: string, keyspace: string): Observable<ScyllaTables>{
        let r = new Request( `${ScyllaRouter.urlBase}/${namespace}/keyspaces/${keyspace}/tables`, { headers: ScyllaRouter.headers })
        return createObservableFromFetch(r) as Observable<ScyllaTables>
    }
}