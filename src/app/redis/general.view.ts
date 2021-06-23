import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { Status as RedisStatus } from "./redis.router"
import { innerTabClasses } from "../utils-view"
import { RedisState } from "./redis.view"


export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: RedisState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: RedisStatus) => {

                            if(!status.installed ) 
                                return this.installView() 

                            return this.installedView(status)
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
                Backend.redis.triggerInstall(this.state.pack.namespace, {values:{}})
            }
        }
    }

    installedView(status : RedisStatus){

        return {
            class: 'flex-grow-1  p-2',
            children: [
                this.statusView(status)
            ]
        }
    }

    statusView( status : RedisStatus){

        return {}
    }
}
