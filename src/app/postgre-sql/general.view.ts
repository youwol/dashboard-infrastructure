import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Button } from "@youwol/fv-button"
import { Observable, Subscription } from "rxjs"
import { take } from "rxjs/operators"
import { Backend } from "../backend/router"
import { Status as PostgreSqlStatus } from "./postgre-sql.router"
import { innerTabClasses } from "../utils-view"
import { PostgreSqlState } from "./postgre-sql.view"
import { HelmPackage } from "../environment/models"
import { helmView } from "../helm/helm.view"



export class GeneralView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: PostgreSqlState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: PostgreSqlStatus) => {
                            return helmView(status, state.pack as HelmPackage, Backend.postgreSql)
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
            style: {width:'fit-content'},
            innerText: 'Install',
            onclick: (ev) => {
                Backend.postgreSql.triggerInstall(this.state.pack.namespace, {values:{}})
            }
        }
    }

    infoView(status: PostgreSqlStatus){

        return {
            class: 'flex-grow-1  p-2', 
            children: []
        }
    }
}
