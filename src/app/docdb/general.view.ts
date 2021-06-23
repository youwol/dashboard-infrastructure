import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { Status as DocDbStatus } from "../redis/redis.router"
import { innerTabClasses } from "../utils-view"
import { DocDbState } from "./docdb.view"


export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: DocDbState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: DocDbStatus) => {

                            if(!status.installed ) 
                                return installView(this.state) 

                            return installedView(status)
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

function installView(state: DocDbState ){

    return {
        class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
        innerText: 'Install',
        style: {width:'fit-content'},
        onclick: (ev) => {
            Backend.docdb.triggerInstall(state.pack.namespace, {values:{}})
        }
    }
}


function installedView(status : DocDbStatus){

    return {
        class: 'flex-grow-1  p-2',
        children: [
            statusView(status)
        ]
    }
}

function statusView( status : DocDbStatus){

    return {}
}
