import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { DocDbState, DocDbView } from "./docdb/docdb.view"
import { EnvironmentState, EnvironmentView } from "./environment/environment.view"
import { K8sDashboardState, K8sDashboardView } from "./k8s-dashboard/k8s-dashboard.view"
import { KongState, KongView } from "./kong/kong.view"
import { MinioState, MinioView } from "./minio/minio.view"
import { PanelId, tabsDisplayInfo } from "./panels-info"
import { PostgreSqlState, PostgreSqlView } from "./postgre-sql/postgre-sql.view"
import { RedisState, RedisView } from "./redis/redis.view"
import { ScyllaState, ScyllaView } from "./scylla/scylla.view"
import { StorageState, StorageView } from "./storage/storage.view"

export class AppState {

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


    public readonly selected$ = new BehaviorSubject<PanelId>(PanelId.ConfigurationCluster)

    configurationState = new EnvironmentState(this.selected$)
    k8sDashboardState = new K8sDashboardState(this.selected$)
    postgreSqlState = new PostgreSqlState(this.selected$)
    kongState = new KongState(this.selected$)
    minioState = new MinioState(this.selected$)
    scyllaState = new ScyllaState(this.selected$)
    docdbState = new DocDbState(this.selected$)
    storageState = new StorageState(this.selected$)
    redisState = new RedisState(this.selected$)


    panelViewFactory$ = this.selected$.pipe(
        map(selected => {

            if ([PanelId.ConfigurationCluster].includes(selected)) {
                return new EnvironmentView(this.configurationState)
            }
            if ([PanelId.K8sDashboardGeneral].includes(selected)) {
                return new K8sDashboardView(this.k8sDashboardState)
            }
            if ([PanelId.PostgreSqlGeneral].includes(selected)) {
                return new PostgreSqlView(this.postgreSqlState)
            }
            if ([PanelId.KongGeneral, PanelId.KongAdmin].includes(selected)) {
                return new KongView(this.kongState)
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
    )

    constructor() {
    }
}