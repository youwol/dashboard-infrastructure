import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { Subject } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { innerTabClasses } from "../utils-view"
import { ScyllaKeyspace, ScyllaTable, ScyllaRouter, ScyllaKeyspaces, ScyllaTables, Status } from "./scylla.router"
import { ScyllaState } from "./scylla.view"



export class ExplorerView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    public readonly selectedKeyspace$ = new Subject<string>()
    connectedCallback: (elem) => void

    constructor(public readonly state: ScyllaState) {

        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    child$(
                        this.state.status$,
                        (status) => this.connectionView(status)
                    ),
                    {
                        tag: 'hr', class: 'fv-color-primary'
                    },
                    child$(
                        ScyllaRouter.getKeyspaces$(state.pack.namespace),
                        (resp: ScyllaKeyspaces) => this.keyspacesTableView(resp.keyspaces)
                    ),
                    {
                        tag: 'hr', class: 'fv-color-primary'
                    },
                    child$(
                        this.selectedKeyspace$.pipe(
                            mergeMap( (keyspace) => ScyllaRouter.getTables$(state.pack.namespace, keyspace) )
                            ),
                        (resp: ScyllaTables) => this.tablesTableView(resp.tables)
                    )
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
        }
    }

    connectionView(status: Status): VirtualDOM{

        return {
            class:'d-flex align-items-center',
            children:[
                {
                    tag:'i',
                    class:'fas fa-terminal'
                },
                {   tag:'a', 
                    class:'px-2',
                    href:status.cqlshUrl,
                    innerText: 'Execute cqlsh queries'
                }
            ]
        }
    }

    keyspacesTableView(keyspaces: Array<ScyllaKeyspace>): VirtualDOM {

        return {
            children: [
                {
                    innerText:"Keyspaces:", class:'fv-text-focus',
                },
                {
                    tag: 'table', class: 'fv-color-primary mx-auto text-center my-2',
                    style: { 'max-height': '100%' },
                    children: [
                        {
                            tag: 'thead',
                            children: [
                                {
                                    tag: 'tr', class: 'fv-bg-background-alt',
                                    children: [
                                        { tag: 'td', class: "px-3", innerText: 'name' },
                                        { tag: 'td', class: "px-3", innerText: 'durable writes' },
                                        { tag: 'td', class: "px-3", innerText: 'replication class' },
                                        { tag: 'td', class: "px-3", innerText: 'replication factor' },
                                    ]
                                }
                            ]
                        },
                        {
                            tag: 'tbody',
                            children: keyspaces
                                .map((keyspace: ScyllaKeyspace) => {
                                    return {
                                        tag: 'tr',
                                        class: 'fv-pointer fv-hover-bg-background-alt',
                                        onclick: () => this.selectedKeyspace$.next(keyspace.name),
                                        children: [
                                            { tag: 'td', class: "px-3", innerText: keyspace.name },
                                            { tag: 'td', class: "px-3", innerText: keyspace.durableWrites },
                                            { tag: 'td', class: "px-3", innerText: keyspace.replication.class },
                                            { tag: 'td', class: "px-3", innerText: keyspace.replication.replication_factor }
                                        ]
                                    }
                                })
                        }
                    ]

                }
            ]
        }
    }

    tablesTableView(tables: Array<ScyllaTable>): VirtualDOM {

        return {
            children: [
                {
                    innerText:"Tables:", class:'fv-text-focus',
                },
                {
                    tag: 'table', class: 'fv-color-primary mx-auto text-center my-2',
                    style: { 'max-height': '100%' },
                    children: [
                        {
                            tag: 'thead',
                            children: [
                                {
                                    tag: 'tr', class: 'fv-bg-background-alt',
                                    children: [
                                        { tag: 'td', class: "px-3", innerText: 'keyspace' },
                                        { tag: 'td', class: "px-3", innerText: 'name' }
                                    ]
                                }
                            ]
                        },
                        {
                            tag: 'tbody',
                            children: tables
                                .map((table: ScyllaTable) => {
                                    return {
                                        tag: 'tr',
                                        class: 'fv-pointer fv-hover-bg-background-alt',
                                        children: [
                                            { tag: 'td', class: "px-3", innerText: table.keyspaceName },
                                            { tag: 'td', class: "px-3", innerText: table.tableName }
                                        ]
                                    }
                                })
                        }
                    ]

                }
            ]
        }
    }

}