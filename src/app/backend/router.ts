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
import { KeycloakRouter } from "../keycloak/keycloak.router";
import { TreeDbBackendRouter } from "../treedb-backend/router";
import { AssetsBackendRouter } from "../assets-backend/router";
import { FluxBackendRouter } from "../flux-backend/router";
import { AssetsGatewayRouter } from "../assets-gateway/router";
import { FrontApiRouter } from "../front-api/router";
import { WorkspaceExplorerRouter } from "../workspace-explorer/router";
import { FluxBuilderRouter } from "../flux-builder/router";
import { FluxRunnerRouter } from "../flux-runner/router";
import { NetworkRouter } from "../network/router";
import { NetworkBackendRouter } from "../network-backend/router";
import { StoriesBackendRouter } from "../stories-backend/router";
import { StoriesRouter } from "../stories/router";
import { ExhibitionHallsRouter } from "../exhibition-halls/router";
import { CdnAppsServerRouter } from "../cdn-apps-server/cdn.router";

export function createObservableFromFetch(request, extractFct = (d) => d) {

    return new Observable(observer => {
        fetch(request)
            .then(response => response.json()) // or text() or blob() etc.
            .then(data => {
                observer.next(extractFct(data));
                observer.complete();
            })
            .catch(err => observer.error(err));
    });
}
export function createTextObservableFromFetch(request, extractFct = (d) => d) {

    return new Observable(observer => {
        fetch(request)
            .then(response => response.text()) // or text() or blob() etc.
            .then(data => {
                observer.next(extractFct(data));
                observer.complete();
            })
            .catch(err => observer.error(err));
    });
}



export class Backend {

    static urlBase = '/api/infra-backend'

    static headers: { [key: string]: string } = {}

    static setHeaders(headers: { [key: string]: string }) {
        Backend.headers = headers
        EnvironmentRouter.headers = headers
        LogsRouter.headers = headers
        K8sDashboardRouter.headers = headers
        PostgreSqlRouter.headers = headers
        KongRouter.headers = headers
        MinioRouter.headers = headers
        ScyllaRouter.headers = headers
        DocDbRouter.headers = headers
        StorageRouter.headers = headers
        RedisRouter.headers = headers
        CDNRouter.headers = headers
        CdnAppsServerRouter.headers = headers
        TreeDbBackendRouter.headers = headers
        AssetsBackendRouter.headers = headers
        KeycloakRouter.headers = headers
        FluxBackendRouter.headers = headers
        AssetsGatewayRouter.headers = headers
        FrontApiRouter.headers = headers
        WorkspaceExplorerRouter.headers = headers
        FluxBuilderRouter.headers = headers
        FluxRunnerRouter.headers = headers
        NetworkRouter.headers = headers
        NetworkBackendRouter.headers = headers
        StoriesRouter.headers = headers
        StoriesBackendRouter.headers = headers
        ExhibitionHallsRouter.headers = headers
    }

    private static webSocket$: ReplaySubject<any>
    private static messagesByPackages$: { [key: string]: ReplaySubject<any> } = {}
    private static logs$ = new ReplaySubject()

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
    static cdnAppServer = CdnAppsServerRouter
    static keycloak = KeycloakRouter
    static treedb = TreeDbBackendRouter
    static assetsBackend = AssetsBackendRouter
    static assetsGateway = AssetsGatewayRouter
    static fluxBackend = FluxBackendRouter
    static frontApi = FrontApiRouter
    static workspaceExplorer = WorkspaceExplorerRouter
    static fluxBuilder = FluxBuilderRouter
    static fluxRunner = FluxRunnerRouter
    static network = NetworkRouter
    static networkBackend = NetworkBackendRouter
    static stories = StoriesRouter
    static storiesBackend = StoriesBackendRouter
    static exhibitionHalls = ExhibitionHallsRouter

    static connectWs(): Promise<any> {

        let promise = new Promise((resolve, reject) => {

            if (Backend.webSocket$) {
                resolve(Backend.webSocket$)
                return
            }
            Backend.webSocket$ = new ReplaySubject()
            let socket_url = `ws://localhost:2260/ws`
            var ws = new WebSocket(socket_url);

            ws.onmessage = (event) => {
                let d = JSON.parse(event.data)
                Backend.webSocket$.next(d)
                if (d.type == 'log')
                    Backend.logs$.next(d)

                if (d.package && d.topic) {
                    let channel$ = Backend.channel$(d.package.name, d.package.namespace, d.topic)
                    channel$.next(d)
                }
            };
            Backend.webSocket$.pipe(
                take(1)
            ).subscribe(
                () => {
                    resolve(Backend.webSocket$)
                }
            )
            //return resolve(Backend.webSocket$)
        })
        return promise
    }


    static channel$(name: string, namespace: string, topic: string): ReplaySubject<any> {

        let packageId = `${namespace}#${name}@${topic}`
        if (!Backend.messagesByPackages$[packageId]) {
            console.log("create channel", packageId)
            Backend.messagesByPackages$[packageId] = new ReplaySubject()
        }

        return Backend.messagesByPackages$[packageId]
    }
}
