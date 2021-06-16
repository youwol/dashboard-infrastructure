import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { EnvironmentState, EnvironmentView } from "./environment/environment.view"
import { K8sDashboardState, K8sDashboardView } from "./k8s-dashboard/k8s-dashboard.view"
import { PanelId, tabsDisplayInfo } from "./panels-info"

export class AppState{

    public readonly environmentChildren$ = new BehaviorSubject([
        PanelId.ConfigurationCluster
    ])
    public readonly k8sDashboardChildren$ = new BehaviorSubject([
        PanelId.K8sDashboardGeneral
    ])
    

    public readonly selected$ = new BehaviorSubject<PanelId>(PanelId.ConfigurationCluster)

    configurationState = new EnvironmentState(this.selected$)
    k8sDashboardState = new K8sDashboardState(this.selected$)

    panelViewFactory$ = this.selected$.pipe(
        map( selected => {
    
            if ([PanelId.ConfigurationCluster].includes(selected)){
                return new EnvironmentView(this.configurationState)
            }
            if ([PanelId.K8sDashboardGeneral].includes(selected)){
                return new K8sDashboardView(this.k8sDashboardState)
            }
        })
    )

    constructor(){
    }
}