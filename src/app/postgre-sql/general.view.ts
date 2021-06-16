import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { Observable, Subscription } from "rxjs"
import { take } from "rxjs/operators"
import { Backend } from "../backend/router"
import { Status as PostgreSqlStatus } from "../backend/postgre-sql.router"
import { innerTabClasses } from "../utils-view"





export class GeneralState {

    static status$ : Observable<PostgreSqlStatus> = Backend.postgreSql.status$

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
                        (status: PostgreSqlStatus) => {

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
        style: {width:'fit-content'},
        innerText: 'Install',
        onclick: (ev) => {
            Backend.postgreSql.triggerInstall()
        }
    }
}
function infoView(status: PostgreSqlStatus){

    return {
        class: 'flex-grow-1  p-2', 
        children: []
    }
}