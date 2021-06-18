import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Observable, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { Status as MinioStatus } from "../backend/minio.router"
import { innerTabClasses } from "../utils-view"





export class GeneralState {

    static status$ : Observable<MinioStatus> = Backend.minio.status$

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
                        (status: MinioStatus) => {

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
            Backend.minio.triggerInstall()
        }
    }
}

function upgradeView(){

    return {
        class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
        innerText: 'Upgrade',
        style: {width:'fit-content'},
        onclick: (ev) => {
            Backend.minio.triggerUpgrade()
        }
    }
}

function installedView(status : MinioStatus){

    return {
        class: 'flex-grow-1  p-2',
        children: [
            upgradeView(),
            statusView(status)
        ]
    }
}

function statusView( status : MinioStatus){

    return {
        class: 'flex-grow-1  p-2',
        children: [
            {
                tag:'hr', class:'fv-color-primary'
            },
            {
                class:'d-flex',
                children:[
                    {
                        innerText: "browse"
                    },
                    {   tag:'a',
                        class:'px-2 fv-text-focus',
                        innerText: status.url,
                        href:status.url
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
                        innerText: "access key"
                    },
                    {   class:'px-2 fv-text-focus',
                        innerText: status.accessKey
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
                        innerText: "secret key"
                    },
                    {   class:'px-2 fv-text-focus',
                        innerText: status.secretKey
                    },
                ]
            }
        ]
    }
}
