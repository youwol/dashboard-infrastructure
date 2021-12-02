
import { BehaviorSubject, Subject } from "rxjs"
import { AssetsBackendState, AssetsBackendView } from "./assets-backend/view"
import { AssetsGatewayState, AssetsGatewayView } from "./assets-gateway/view"
import { Backend } from "./backend/router"
import { CDNState, CDNView } from "./cdn/cdn.view"
import { DocDbState, DocDbView } from "./docdb/docdb.view"
import { Package } from "./environment/models"
import { FluxBackendState, FluxBackendView } from "./flux-backend/view"
import { FluxBuilderState, FluxBuilderView } from "./flux-builder/view"
import { FluxRunnerState, FluxRunnerView } from "./flux-runner/view"
import { NetworkState, NetworkView } from "./network/view"
import { FrontApiState, FrontApiView } from "./front-api/view"
import { K8sDashboardState, K8sDashboardView } from "./k8s-dashboard/k8s-dashboard.view"
import { KeycloakState, KeycloakView } from "./keycloak/keycloak.view"
import { KongState, KongView } from "./kong/kong.view"
import { MinioState, MinioView } from "./minio/minio.view"
import { PackageState } from "./models"
import { PanelId } from "./panels-info"
import { PostgreSqlState, PostgreSqlView } from "./postgre-sql/postgre-sql.view"
import { RedisState, RedisView } from "./redis/redis.view"
import { ScyllaState, ScyllaView } from "./scylla/scylla.view"
import { StorageState, StorageView } from "./storage/storage.view"
import { TreeDbBackendState, TreeDbBackendView } from "./treedb-backend/view"
import { WorkspaceExplorerState, WorkspaceExplorerView } from "./workspace-explorer/view"
import { NetworkBackendState, NetworkBackendView } from "./network-backend/view"
import { StoriesBackendState, StoriesBackendView } from "./stories-backend/view"
import { StoriesState, StoriesView } from "./stories/view"
import { ExhibitionHallsState, ExhibitionHallsView } from "./exhibition-halls/view"
import { CdnAppsServerState, CdnAppsServerView } from "./cdn-apps-server/cdn.view"

class PackageFactory<TState, TView>{

    constructor(public readonly State: any, public readonly View: any) { }
}

let packagesFactory: { [key: string]: PackageFactory<unknown, unknown> } = {
    k8sDashboard: new PackageFactory(K8sDashboardState, K8sDashboardView),
    postgresql: new PackageFactory(PostgreSqlState, PostgreSqlView),
    api: new PackageFactory(KongState, KongView),
    minio: new PackageFactory(MinioState, MinioView),
    scylla: new PackageFactory(ScyllaState, ScyllaView),
    redis: new PackageFactory(RedisState, RedisView),
    docdb: new PackageFactory(DocDbState, DocDbView),
    storage: new PackageFactory(StorageState, StorageView),
    'cdn-backend': new PackageFactory(CDNState, CDNView),
    'cdn-apps-server': new PackageFactory(CdnAppsServerState, CdnAppsServerView),
    'treedb-backend': new PackageFactory(TreeDbBackendState, TreeDbBackendView),
    'assets-backend': new PackageFactory(AssetsBackendState, AssetsBackendView),
    'assets-gateway': new PackageFactory(AssetsGatewayState, AssetsGatewayView),
    'flux-backend': new PackageFactory(FluxBackendState, FluxBackendView),
    auth: new PackageFactory(KeycloakState, KeycloakView),
    'front-api': new PackageFactory(FrontApiState, FrontApiView),
    'workspace-explorer': new PackageFactory(WorkspaceExplorerState, WorkspaceExplorerView),
    'flux-builder': new PackageFactory(FluxBuilderState, FluxBuilderView),
    'flux-runner': new PackageFactory(FluxRunnerState, FluxRunnerView),
    'network': new PackageFactory(NetworkState, NetworkView),
    'network-backend': new PackageFactory(NetworkBackendState, NetworkBackendView),
    'stories': new PackageFactory(StoriesState, StoriesView),
    'stories-backend': new PackageFactory(StoriesBackendState, StoriesBackendView),
    'exhibition-halls': new PackageFactory(ExhibitionHallsState, ExhibitionHallsView),
}


export class AppState {

    public readonly clusterContext$ = new Subject<string>()
    public readonly selectedPackage$ = new Subject<Package>()
    public readonly selectedPanel$ = new BehaviorSubject<PanelId>(PanelId.None)

    public readonly packagesState$ = new BehaviorSubject<PackageState[]>([])

    panelViewFactory$ = new Subject()

    constructor() {
        Backend.environment.connectWs()
        Backend.environment.environments$.subscribe(
            (env) => {
                this.clusterContext$.next(env.deploymentConfiguration.general.contextName)
                let packagesState = []
                env.deploymentConfiguration.packages.forEach((pack: Package) => {

                    let factory = packagesFactory[pack.name]
                    packagesState.push(new factory.State(pack, this.selectedPanel$))
                })
                this.packagesState$.next(packagesState)
            }
        )
    }

    select(name: string, namespace: string, panelId: PanelId) {

        this.selectedPanel$.next(panelId)
        let packagesState = this.packagesState$.getValue()

        let state = packagesState.find(s => s.pack.namespace == namespace && s.pack.name == name)
        let viewFactory = packagesFactory[state.pack.name].View
        this.panelViewFactory$.next(new viewFactory(state))
        this.selectedPackage$.next(state.pack)
    }
}
