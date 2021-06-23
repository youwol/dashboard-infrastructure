import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Backend } from "../backend/router"
import { Status as MinioStatus } from "./minio.router"
import { innerTabClasses } from "../utils-view"
import { MinioState } from "./minio.view"



export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: MinioState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: MinioStatus) => {

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
                Backend.minio.triggerInstall(this.state.pack.namespace, {values:{}})
            }
        }
    }

    upgradeView(){

        return {
            class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt',
            innerText: 'Upgrade',
            style: {width:'fit-content'},
            onclick: (ev) => {
                Backend.minio.triggerUpgrade(this.state.pack.namespace, {values:{}})
            }
        }
    }

    installedView(status : MinioStatus){

        return {
            class: 'flex-grow-1  p-2',
            children: [
                this.upgradeView(),
                this.statusView(status)
            ]
        }
    }

    statusView( status : MinioStatus){

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
    
}
