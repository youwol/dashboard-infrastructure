import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { Observable, Subscription } from "rxjs"
import { take } from "rxjs/operators"
import { Backend } from "../backend/router"
import { Status as K8sDashboardStatus } from "../backend/k8s-dashboard.router"
import { innerTabClasses } from "../utils-view"





export class GeneralState {

    static status$ : Observable<K8sDashboardStatus> = Backend.k8sDashboard.status$

    constructor() {
    }

    subscribe() : Array<Subscription> {
        return []
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
                        GeneralState.status$,
                        (status: K8sDashboardStatus) => {

                            if(!status.installed ) 
                                return installView() 
                            return infoView(status)
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

function installView(){

    return {
        class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
        innerText: 'Install',
        onclick: (ev) => {
            Backend.k8sDashboard.triggerInstall()
        }
    }
}
function infoView(status: K8sDashboardStatus){

    return {
        class: 'flex-grow-1  p-2',
        children: [
            {
                class:'d-flex',
                children:[
                    {
                        innerText: "Access token"
                    },
                    {   class:'px-2 fv-text-focus',
                        innerText: status.accessToken
                    },
                ]
            },
            {
                tag:'hr', class:'fv-color-primary'
            },
            {
                class:'d-flex',
                children:[
                    {
                        innerText: "K8s API proxy"
                    },
                    {   tag:'a',
                        class:'px-2 fv-text-focus',
                        innerText: status.dashboardUrl,
                        href:status.dashboardUrl
                    },
                ]
            }
        ]
    }
}