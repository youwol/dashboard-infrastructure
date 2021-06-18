import { attr$, child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { RouteResp, RoutesResp, ServiceResp, ServicesResp, Status as KongStatus } from "../backend/kong.router"
import { innerTabClasses } from "../utils-view"
import { DataTreeView } from "../views/data-tree.view"
import { filter, mergeMap } from "rxjs/operators"





export class KongAdminState {

    static status$ : Observable<KongStatus> = Backend.kong.status$

    selectedService$ = new BehaviorSubject<string>(undefined)
    constructor() {
    }

    subscribe() : Array<Subscription> {
        return []
    }
}


export class KongAdminView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    connectedCallback: (elem) => void

    constructor(public readonly state: KongAdminState) {
        
        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        KongAdminState.status$,
                        (status: KongStatus) => {

                            if(!status.installed ) 
                                return {
                                    innerText: "Kong is not installed"
                                }
                            return this.view()
                        }
                    ),
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
            elem.ownSubscriptions(...state.subscribe())
        }
    }

    view(){
        return {
            class:"h-100 d-flex flex-column",
            children: [
                child$(
                    Backend.kong.kongAdminInfo$(),
                    (resp) => {
                        let state =  new DataTreeView.State({
                            title:'raw kong-admin service',
                            data:resp
                        })
                        return new DataTreeView.View({state} as any)
                    }
                ),
                {
                    class: 'flex-grow-1 overflow-auto',
                    children:[
                        {
                            class:'h-50 overflow-auto',
                            children:[
                                child$(
                                    Backend.kong.kongAdminServices$(),
                                    (resp: ServicesResp) => {
                                        return servicesTableView(resp.data, this.state) 
                                    }
                                )
                            ]
                        },
                        {
                            class:'',
                            children:[
                                child$(
                                    this.state.selectedService$.pipe(
                                        filter( selected => selected != undefined),
                                        mergeMap( (selected) => Backend.kong.kongAdminRoutes$(selected))
                                    ),
                                    (resp: RoutesResp) => {
                                        return routesTableView(resp.data, this.state) 
                                    }
                                )
                            ]
                        }
                    ]
                }
            ]
        }
    }
}


function routesTableView(routes: Array<RouteResp>, state:KongAdminState){

        return {
            tag: 'table', class: 'fv-color-primary mx-auto text-center my-2 h-50',
            style: { 'max-height': '100%' },
            children: [
                {
                    tag: 'thead',
                    children: [
                        {
                            tag: 'tr', class: 'fv-bg-background-alt',
                            children: [
                                { tag: 'td', class:"px-3", innerText: 'name' },
                                { tag: 'td', class:"px-3", innerText: 'hosts' },
                                { tag: 'td', class:"px-3", innerText: 'paths' }
                            ]
                        }
                    ]
                },
                {
                    tag: 'tbody',
                    children: routes
                        .map((route: RouteResp) => {
                            return {
                                tag: 'tr',
                                children: [
                                    { tag: 'td', class:"px-3", innerText: route.name },
                                    { tag: 'td', class:"px-3", innerText: route.hosts },
                                    { tag: 'td', class:"px-3", innerText: route.paths }
                                ]
                            }
                        })
                }
            ]
    
        }
}


function servicesTableView(services: Array<ServiceResp>, state:KongAdminState){

    return {
        tag: 'table', class: 'fv-color-primary mx-auto text-center my-2 h-50',
        style: { 'max-height': '100%' },
        children: [
            {
                tag: 'thead',
                children: [
                    {
                        tag: 'tr', class: 'fv-bg-background-alt',
                        children: [
                            { tag: 'td', class:"px-3", innerText: 'name' },
                            { tag: 'td', class:"px-3", innerText: 'host' },
                            { tag: 'td', class:"px-3", innerText: 'path' },
                            { tag: 'td', class:"px-3", innerText: 'port' },
                            { tag: 'td', class:"px-3", innerText: 'updated' }
                        ]
                    }
                ]
            },
            {
                tag: 'tbody',
                children: services
                    .map((service: ServiceResp) => {
                        return {
                            tag: 'tr',
                            onclick: ()=>state.selectedService$.next(service.name),
                            class: attr$(
                                state.selectedService$,
                                (selected) => selected == service.name ? 'fv-bg-focus ': 'fv-hover-bg-background-alt ',
                                {
                                    wrapper: (d) => d + 'fv-pointer'
                                }
                                ),
                            children: [
                                { tag: 'td', class:"px-3", innerText: service.name },
                                { tag: 'td', class:"px-3", innerText: service.host },
                                { tag: 'td', class:"px-3", innerText: service.path },
                                { tag: 'td', class:"px-3", innerText: service.port },
                                { tag: 'td', class:"px-3", innerText: service.updatedAt }
                            ]
                        }
                    })
            }
        ]

    }
}