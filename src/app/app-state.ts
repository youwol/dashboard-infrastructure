import { BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"
import { EnvironmentState, EnvironmentView } from "./environment/environment.view"
import { PanelId, tabsDisplayInfo } from "./panels-info"

export class AppState{

    public readonly environmentChildren$ = new BehaviorSubject([
        PanelId.ConfigurationCluster
    ])
    public readonly infraChildren$ = new BehaviorSubject([
        PanelId.InfraSQL
    ])
    public readonly apiGatewayChildren$ = new BehaviorSubject([
        PanelId.ApiGatewayKong
    ])
    

    public readonly selected$ = new BehaviorSubject<PanelId>(PanelId.ConfigurationCluster)

    configurationState = new EnvironmentState(this.selected$)

    panelViewFactory$ = this.selected$.pipe(
        map( selected => {
    
            if ([PanelId.ConfigurationCluster].includes(selected)){
                return new EnvironmentView(this.configurationState)
            }
        })
    )

    constructor(){
    }
}