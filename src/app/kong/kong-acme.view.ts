import { attr$, child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { RouteResp, RoutesResp, ServiceResp, ServicesResp, Status as KongStatus } from "./kong.router"
import { innerTabClasses } from "../utils-view"
import { DataTreeView } from "../views/data-tree.view"
import { filter, mergeMap } from "rxjs/operators"
import { KongState } from "./kong.view"



export class KongAcmeView implements VirtualDOM {

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

                            if (!status.installed)
                                return {
                                    innerText: "Kong is not installed"
                                }
                            return this.view(status)
                        }
                    ),
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
            elem.ownSubscriptions(...state.subscribe())
        }
    }

    view(status: KongStatus) {
        let state = new DataTreeView.State({
            title: 'Acme data',
            data: {'certs.yaml':status.package.acmePlugin, 'hosts':status.package.acmeHosts }
        })
        return {
            children:[
                new DataTreeView.View({ state } as any),
                {
                    class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt my-auto',
                    innerText: 'Install certificates',
                    style: {width:'fit-content'},
                    onclick: (ev) => { 
                        Backend.kong.triggerInstallCertificates(this.state.pack.namespace) 
                    }
                }
            ] 
        }
    }
}
