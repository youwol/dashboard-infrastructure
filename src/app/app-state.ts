import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { EnvironmentState, EnvironmentView } from "./environment/environment.view"
import { K8sDashboardState, K8sDashboardView } from "./k8s-dashboard/k8s-dashboard.view"
import { KongState, KongView } from "./kong/kong.view"
import { MinioState, MinioView } from "./minio/minio.view"
import { PanelId, tabsDisplayInfo } from "./panels-info"
import { PostgreSqlState, PostgreSqlView } from "./postgre-sql/postgre-sql.view"

export class AppState{

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

    public readonly selected$ = new BehaviorSubject<PanelId>(PanelId.ConfigurationCluster)

    configurationState = new EnvironmentState(this.selected$)
    k8sDashboardState = new K8sDashboardState(this.selected$)
    postgreSqlState = new PostgreSqlState(this.selected$)
    kongState = new KongState(this.selected$)
    minioState = new MinioState(this.selected$)
    scyllaState = new ScyllaState(this.selected$)


    panelViewFactory$ = this.selected$.pipe(
        map( selected => {
    
            if ([PanelId.ConfigurationCluster].includes(selected)){
                return new EnvironmentView(this.configurationState)
            }
            if ([PanelId.K8sDashboardGeneral].includes(selected)){
                return new K8sDashboardView(this.k8sDashboardState)
            }
            if ([PanelId.PostgreSqlGeneral].includes(selected)){
                return new PostgreSqlView(this.postgreSqlState)
            }
            if ([PanelId.KongGeneral, PanelId.KongAdmin].includes(selected)){
                return new KongView(this.kongState)
            }
            if ([PanelId.MinioGeneral].includes(selected)){
                return new MinioView(this.minioState)
            }
            if ([PanelId.ScyllaGeneral].includes(selected)) {
                return new ScyllaView(this.scyllaState)
            }
        })
    )

    constructor(){
    }
}