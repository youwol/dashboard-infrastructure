import { Interface } from "node:readline"
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs"
import { map } from "rxjs/operators"
import { Backend } from "./backend/router"
import { DocDbState, DocDbView } from "./docdb/docdb.view"
import { EnvironmentState, EnvironmentView } from "./environment/environment.view"
import { Package } from "./environment/models"
import { K8sDashboardState, K8sDashboardView } from "./k8s-dashboard/k8s-dashboard.view"
import { KongState, KongView } from "./kong/kong.view"
import { MinioState, MinioView } from "./minio/minio.view"
import { DeploymentStatus, PackageState, SanityEnum } from "./models"
import { PanelId, tabsDisplayInfo } from "./panels-info"
import { PostgreSqlState, PostgreSqlView } from "./postgre-sql/postgre-sql.view"
import { RedisState, RedisView } from "./redis/redis.view"
import { ScyllaState, ScyllaView } from "./scylla/scylla.view"
import { StorageState, StorageView } from "./storage/storage.view"

class PackageFactory<TState, TView>{

    constructor( public readonly State: any, public readonly View: any){}
}

let packagesFactory: {[key:string]: PackageFactory<unknown, unknown>} = {
    environment: new PackageFactory(EnvironmentState, EnvironmentView),
    k8sDashboard: new PackageFactory(K8sDashboardState, K8sDashboardView),
    postgresql: new PackageFactory(PostgreSqlState, PostgreSqlView),
    api: new PackageFactory(KongState, KongView),
    minio:new PackageFactory(MinioState, MinioView),
    scylla: new PackageFactory(ScyllaState, ScyllaView),
    redis: new PackageFactory(RedisState, RedisView),
    docdb: new PackageFactory(DocDbState, DocDbView),
    storage: new PackageFactory(StorageState,StorageView)
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
                env.deploymentConfiguration.packages.forEach( (pack: Package) => {

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

        let state = packagesState.find( s => s.pack.namespace==namespace &&  s.pack.name==name)
        let viewFactory = packagesFactory[state.pack.name].View
        this.panelViewFactory$.next(new viewFactory(state))
    }

}

 /*combineLatest([
        this.selectedPackage$,
        this.packagesState$
    ]).pipe(
            map( ([selected, packagesState]) => {

                let state = packagesState.find( s => s.pack.namespace== selected.namespace &&  s.pack.name== selected.name)
                let viewFactory = packagesFactory[state.pack.name].View
                return new viewFactory(state)
            })
    )*/

    /*public readonly children$ = {
        environment: new BehaviorSubject([
            PanelId.ConfigurationCluster
        ]),
        k8sDashboard: new BehaviorSubject([
            PanelId.K8sDashboardGeneral
        ]),
        postgresql:new BehaviorSubject([
            PanelId.PostgreSqlGeneral
        ]),
        api:new BehaviorSubject([
            PanelId.KongGeneral,
            PanelId.KongAdmin
        ]),
        minio:new BehaviorSubject([
            PanelId.MinioGeneral
        ]),
        scylla: new BehaviorSubject([
            PanelId.ScyllaGeneral
        ]),
        redis: new BehaviorSubject([
            PanelId.RedisGeneral
        ]),
        docdb: new BehaviorSubject([
            PanelId.DocDbGeneral
        ]),
        storage: new BehaviorSubject([
            PanelId.StorageGeneral
        ])
    }

    public readonly environmentChildren$ = new BehaviorSubject([
        PanelId.ConfigurationCluster
    ])
    public readonly k8sDashboardChildren$ = new BehaviorSubject([
        PanelId.K8sDashboardGeneral
    ])
    public readonly postgreSqlChildren$ = new BehaviorSubject([
        PanelId.PostgreSqlGeneral
    ])
    public readonly kongChildren$ = new BehaviorSubject([
        PanelId.KongGeneral,
        PanelId.KongAdmin
    ])
    public readonly minioChildren$ = new BehaviorSubject([
        PanelId.MinioGeneral
    ])
    public readonly scyllaChildren$ = new BehaviorSubject([
        PanelId.ScyllaGeneral
    ])
    public readonly docdbChildren$ = new BehaviorSubject([
        PanelId.DocDbGeneral
    ])
    public readonly storageChildren$ = new BehaviorSubject([
        PanelId.StorageGeneral
    ])
    public readonly redisChildren$ = new BehaviorSubject([
        PanelId.RedisGeneral
    ])

    configurationState = new EnvironmentState(this.selected$)
    k8sDashboardState = new K8sDashboardState(this.selected$)
    postgresqlState = new PostgreSqlState(this.selected$)
    apiState = new KongState(this.selected$)
    minioState = new MinioState(this.selected$)
    scyllaState = new ScyllaState(this.selected$)
    docdbState = new DocDbState(this.selected$)
    storageState = new StorageState(this.selected$)
    redisState = new RedisState(this.selected$)
    

    panelViewFactory$ = combineLatest([
        this.selectedPanel$,
        this.packagesState$
    ]).pipe(
            map( ([selected, packageState]) => {

                if ([PanelId.ConfigurationCluster].includes(selected)) {
                    return new EnvironmentView(this.configurationState)
                }
                if ([PanelId.K8sDashboardGeneral].includes(selected)) {
                    return new K8sDashboardView(this.k8sDashboardState)
                }
                if ([PanelId.PostgreSqlGeneral].includes(selected)) {
                    return new PostgreSqlView(this.postgresqlState)
                }
                if ([PanelId.KongGeneral, PanelId.KongAdmin].includes(selected)) {
                    return new KongView(this.apiState)
                }
                if ([PanelId.MinioGeneral].includes(selected)) {
                    return new MinioView(this.minioState)
                }
                if ([PanelId.ScyllaGeneral].includes(selected)) {
                    return new ScyllaView(this.scyllaState)
                }
                if ([PanelId.DocDbGeneral].includes(selected)) {
                    return new DocDbView(this.docdbState)
                }
                if ([PanelId.StorageGeneral].includes(selected)) {
                    return new StorageView(this.storageState)
                }
                if ([PanelId.RedisGeneral].includes(selected)) {
                    return new RedisView(this.redisState)
                }
            })
    )*/