import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Backend } from "../backend/router"
import { Status as KongStatus } from "./kong.router"
import { innerTabClasses } from "../utils-view"
import { KongState } from "./kong.view"
import { helmView } from "../helm/helm.view"
import { HelmPackage } from "../environment/models"


export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: KongState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: KongStatus) => {
                            return helmView(status, state.pack as HelmPackage, Backend.kong)
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