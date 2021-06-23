import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { Status as KongStatus } from "./kong.router"
import { innerTabClasses } from "../utils-view"
import { KongState } from "./kong.view"


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
                    {
                        innerText: "Kong general"
                    },
                    child$(
                        state.status$,
                        (status: KongStatus) => {

                            if(!status.installed ) 
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

    installView(){

        return {
            class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
            innerText: 'Install',
            style: {width:'fit-content'},
            onclick: (ev) => {
                Backend.kong.triggerInstall(this.state.pack.namespace, {values:{}})
            }
        }
    }

    infoView(status: KongStatus){

        return {
            class: 'flex-grow-1  p-2',
            children: []
        }
    }
}