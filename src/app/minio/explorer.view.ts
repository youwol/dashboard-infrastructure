import { child$, VirtualDOM } from "@youwol/flux-view"
import { innerTabClasses } from "../utils-view"
import { Status as MinioStatus } from "./minio.router"
import { MinioState } from "./minio.view"


export class ExplorerView implements VirtualDOM {

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
                                return {}

                            return this.statusView(status)
                        }
                    ),
                ]
            }
        ]
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
