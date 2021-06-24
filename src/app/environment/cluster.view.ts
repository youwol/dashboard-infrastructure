import { attr$, child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { innerTabClasses } from "../utils-view"
import { Backend } from "../backend/router"
import { Environment } from "./models"
import { DataTreeView } from "../views/data-tree.view"
import { configurationPickerView } from "./configuration-picker.view"
import { clusterSummary } from "./configuration-summary.view"
import { ExpandableGroup } from "@youwol/fv-group"


export class GeneralState {

    static environment$ : Observable<Environment> = Backend.environment.environments$

    constructor() {
    }

    subscribe() : Array<Subscription> {
        return []
    }

    static switchConfiguration(path: Array<string>){
        console.log("Switch configuration", path)

        Backend.environment.switchConfiguration$({ path }).subscribe()
    }

}


export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = ""
    public readonly state: GeneralState
    connectedCallback: (elem) => void

    constructor(state: GeneralState) {
        
        this.children = [
            child$(
                GeneralState.environment$,
                (env: Environment) => {
                    let grpState = new ExpandableGroup.State(env.deploymentConfiguration.general.contextName)
                    return new ExpandableGroup.View({
                        state: grpState,
                        headerView: (state) => this.headerView(state),
                        contentView: () => {
                            return {
                                class: '',
                                children:[
                                    configurationPickerView(env),
                                    clusterSummary(env)
                                ]
                            }
                        },
                        class:'border fv-bg-background-alt overflow-auto',
                        style: {'max-height':'25vh'}
                    } as any)
                }
            )
        ]

        this.connectedCallback = (elem: HTMLElement$) => {

            elem.ownSubscriptions(...state.subscribe())
        }
    }


    headerView(grpState){

        return {
            class: "fv-bg-background-alt fv-text-focus fv-color-primary rounded fv-pointer d-flex align-items-center",
            children: [
                {
                    tag: 'i',
                    class: "fas fa-wifi px-2" 
                },
                {
                    tag: 'i',
                    class: attr$(grpState.expanded$,
                        d => d ? "fa-caret-down" : "fa-caret-right",
                        { wrapper: (d) => "px-2 fas " + d }
                    )
                },
                {   tag: 'span', class: 'px-2', innerText: grpState.name, 
                    style: { 'user-select': 'none'}
                }
            ]
        }
    }
}
