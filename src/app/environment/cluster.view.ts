import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { innerTabClasses } from "../utils-view"
import { Backend } from "../backend/router"
import { Environment } from "./models"
import { DataTreeView } from "../views/data-tree.view"
import { configurationPickerView } from "./configuration-picker.view"
import { clusterSummary } from "./configuration-summary.view"


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
    public readonly class = innerTabClasses
    public readonly state: GeneralState
    connectedCallback: (elem) => void

    constructor(state: GeneralState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        GeneralState.environment$,
                        (env) => configurationPickerView(env)
                    ),
                    child$(
                        GeneralState.environment$,
                        (env) => clusterSummary(env)
                    )
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {

            elem.ownSubscriptions(...state.subscribe())
        }
    }
}
