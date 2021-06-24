import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Backend } from "../backend/router"
import { Status as ScyllaStatus } from "./scylla.router"
import { innerTabClasses } from "../utils-view"
import { ScyllaState } from "./scylla.view"
import { helmView } from "../helm/helm.view"
import { HelmPackage } from "../environment/models"


export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: ScyllaState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: ScyllaStatus) => {
                            return helmView(status, state.pack as HelmPackage, Backend.scylla)
                        }
                    ),
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
            elem.ownSubscriptions(...state.subscribe())
        }
    }
}
