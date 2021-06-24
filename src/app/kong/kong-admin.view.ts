import { attr$, child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs"
import { Backend } from "../backend/router"
import { RouteResp, RoutesResp, ServiceResp, ServicesResp, Status as KongStatus } from "./kong.router"
import { innerTabClasses } from "../utils-view"
import { DataTreeView } from "../views/data-tree.view"
import { filter, mergeMap } from "rxjs/operators"
import { KongState } from "./kong.view"





export class KongAdminView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    selectedService$ = new BehaviorSubject<string>(undefined)

    connectedCallback: (elem) => void

    constructor(public readonly state: KongState) {

        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        state.status$,
                        (status: KongStatus) => {

                            if (!status.installed)
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

    view() {
        return {
            class: "h-100 d-flex flex-column",
            children: [
                child$(
                    Backend.kong.kongAdminInfo$(this.state.pack.namespace),
                    (resp) => {
                        let state = new DataTreeView.State({
                            title: 'raw kong-admin service',
                            data: resp
                        })
                        return new DataTreeView.View({ state } as any)
                    }
                ),
                {
                    class: 'flex-grow-1 overflow-auto',
                    children: [
                        {
                            class: '',
                            children: [
                                child$(
                                    Backend.kong.kongAdminServices$(this.state.pack.namespace),
                                    (resp: ServicesResp) => {
                                        return this.servicesTableView(resp.data)
                                    }
                                )
                            ]
                        },
                        {
                            class: '',
                            children: [
                                child$(
                                    this.selectedService$.pipe(
                                        filter(selected => selected != undefined),
                                        mergeMap((selected) => Backend.kong.kongAdminRoutes$(this.state.pack.namespace, selected))
                                    ),
                                    (resp: RoutesResp) => {
                                        return this.routesTableView(resp.data)
                                    }
                                )
                            ]
                        }
                    ]
                }
            ]
        }
    }

    routesTableView(routes: Array<RouteResp>) {

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
                                { tag: 'td', class: "px-3", innerText: 'name' },
                                { tag: 'td', class: "px-3", innerText: 'hosts' },
                                { tag: 'td', class: "px-3", innerText: 'paths' }
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
                                    { tag: 'td', class: "px-3", innerText: route.name },
                                    { tag: 'td', class: "px-3", innerText: route.hosts },
                                    { tag: 'td', class: "px-3", innerText: route.paths }
                                ]
                            }
                        })
                }
            ]

        }
    }

    servicesTableView(services: Array<ServiceResp>) {

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
                                { tag: 'td', class: "px-3", innerText: 'name' },
                                { tag: 'td', class: "px-3", innerText: 'host' },
                                { tag: 'td', class: "px-3", innerText: 'path' },
                                { tag: 'td', class: "px-3", innerText: 'port' },
                                { tag: 'td', class: "px-3", innerText: 'updated' }
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
                                onclick: () => this.selectedService$.next(service.name),
                                class: attr$(
                                    this.selectedService$,
                                    (selected) => selected == service.name ? 'fv-bg-focus ' : 'fv-hover-bg-background-alt ',
                                    {
                                        wrapper: (d) => d + 'fv-pointer'
                                    }
                                ),
                                children: [
                                    { tag: 'td', class: "px-3", innerText: service.name },
                                    { tag: 'td', class: "px-3", innerText: service.host },
                                    { tag: 'td', class: "px-3", innerText: service.path },
                                    { tag: 'td', class: "px-3", innerText: service.port },
                                    { tag: 'td', class: "px-3", innerText: service.updatedAt }
                                ]
                            }
                        })
                }
            ]
        }
    }
}
