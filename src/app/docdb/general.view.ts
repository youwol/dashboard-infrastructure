import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { Status as DocDbStatus } from "../backend/docdb.router"
import { innerTabClasses } from "../utils-view"





export class GeneralState {

    static status$ : Observable<DocDbStatus> = Backend.docdb.status$

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
                        (status: DocDbStatus) => {

                            if(!status.installed ) 
                                return installView() 

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

function installView(){

    return {
        class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
        innerText: 'Install',
        style: {width:'fit-content'},
        onclick: (ev) => {
            Backend.docdb.triggerInstall()
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
