import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { Observable, Subscription } from "rxjs"
import { take } from "rxjs/operators"
import { Backend } from "../backend/router"
import { Status as K8sDashboardStatus } from "./k8s-dashboard.router"
import { innerTabClasses } from "../utils-view"
import { K8sDashboardState } from "./k8s-dashboard.view"





export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: K8sDashboardState) {

        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: K8sDashboardStatus) => {

                            if (!status.installed)
                                return this.installView()

                            return this.infoView(status)
                        }
                    ),
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
            elem.ownSubscriptions(...state.subscribe())
        }
    }

    installView() {

        return {
            class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
            innerText: 'Install',
            style: { width: 'fit-content' },
            onclick: (ev) => {
                Backend.k8sDashboard.triggerInstall(this.state.pack.namespace, { values: {} })
            }
        }
    }

    infoView(status: K8sDashboardStatus) {

        return {
            class: 'flex-grow-1  p-2',
            children: [
                {
                    class: 'd-flex',
                    children: [
                        {
                            innerText: "Access token"
                        },
                        {
                            class: 'px-2 fv-text-focus',
                            innerText: status.accessToken
                        },
                    ]
                },
                {
                    tag: 'hr', class: 'fv-color-primary'
                },
                {
                    class: 'd-flex',
                    children: [
                        {
                            innerText: "K8s API proxy"
                        },
                        {
                            tag: 'a',
                            class: 'px-2 fv-text-focus',
                            innerText: status.dashboardUrl,
                            href: status.dashboardUrl
                        },
                    ]
                }
            ]
        }
    }
}

