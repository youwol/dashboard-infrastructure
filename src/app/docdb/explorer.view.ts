import { child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { ImmutableTree } from "@youwol/fv-tree"
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs"
import { map, mergeMap } from "rxjs/operators"
import { Backend } from "../backend/router"
import { innerTabClasses } from "../utils-view"
import { DocDbRouter, Status } from "./docdb.router"
import {TextInput} from '@youwol/fv-input'
import { DocDbState } from "./docdb.view"


class ExplorerNode extends ImmutableTree.Node{

    name: string
    namespace: string

    constructor({id, name, namespace, children}:
         {id:string, name: string, namespace: string, children?: Observable<ExplorerNode[]>}){

        super({id,children})
        this.name = name
        this.namespace = namespace
    }
}

class RootNode extends ExplorerNode{

    static getKeyspacesChildren(namespace) : Observable<TableNode[]>{

        return Backend.docdb.getKeyspaces$(namespace).pipe(
            map( resp => {
                return resp.keyspaces.map( name => new KeyspaceNode({name, namespace}))
            })
        )
    }

    constructor({ namespace}:
         {namespace: string} ){

        super({id: 'root', name:'keyspaces', namespace, children: RootNode.getKeyspacesChildren(namespace)})
        this.namespace = namespace
    }
}


class TableNode extends ExplorerNode{

    keyspace: string

    constructor({name, namespace, keyspace}:{name:string, namespace: string, keyspace:string,}){
        super({id:name, name, namespace})
        this.keyspace = keyspace
    }
}

class KeyspaceNode extends ExplorerNode{

    static getTablesChildren(namespace, keyspace) : Observable<TableNode[]>{

        return Backend.docdb.getTables$(namespace, keyspace).pipe(
            map( resp => {
                return resp.tables.map( name => new TableNode({name, namespace, keyspace}))
            })
        )
    }
    constructor({name, namespace}:{name:string, namespace: string}){
        super({id:name, name, namespace, children: KeyspaceNode.getTablesChildren(namespace, name)})
    }
}


export class ExplorerView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    public readonly selectedTable$ = new Subject<TableNode>()
    public readonly query$ = new BehaviorSubject<string>("#100")
    connectedCallback: (elem) => void

    constructor(public readonly state: DocDbState) {

        this.children = [
            {
                class: 'flex-grow-1 w-100 h-100',
                children: [
                    {
                        tag: 'hr', class: 'fv-color-primary'
                    },
                    this.treeView(),
                    {
                        tag: 'hr', class: 'fv-color-primary'
                    },
                    child$(
                        combineLatest([
                            this.selectedTable$,
                            this.query$
                        ]).pipe(
                            mergeMap( ([tableNode, query]) => 
                                Backend.docdb.queryTable$(tableNode.namespace, tableNode.keyspace, 
                                    tableNode.name, {queryStr:query} ) )
                            ),
                        (resp: any) => this.queryView(resp.tableName, resp.documents)
                    )
                ]
            }
        ]

        this.connectedCallback = (elem: HTMLElement$) => {
        }
    }


    treeView(): VirtualDOM {

        let rootNode = new RootNode({namespace: this.state.pack.namespace})
        let state = new ImmutableTree.State({rootNode})
        let view = new ImmutableTree.View({state,headerView: (state, node) => this.headerView(state, node)})
        return view
    }

    headerView(treeState: ImmutableTree.State<ExplorerNode>, node: ExplorerNode){

        let classes = 'fv-pointer fv-hover-bg-background-alt'
        if(node instanceof(RootNode)){
            return {innerText: node.name, class:classes}
        }
        if(node instanceof(KeyspaceNode)){
            return {innerText: node.name, class:classes}
        }
        if(node instanceof(TableNode)){
            return {
                innerText: node.name, class:classes ,
                onclick: () => this.selectedTable$.next(node)}
        }
    }
    
    queryView(tableName: string, documents: Array<any>): VirtualDOM {

        let keys = Object.keys(documents[0])
        let stateInput = new TextInput.State(this.query$.getValue())
        let inputView = new TextInput.View({state:stateInput, class:'flex-grow-1 mx-2'} as any)
        
        return {
            class:'overflow-auto',
            style:{'white-space':'nowrap', 'max-height': '100%', 'max-width': '100%'},
            children: [
                {
                    innerText:tableName, class:'fv-text-focus',
                },
                {
                    children:[
                        {
                            class:'d-flex',
                            children:[
                                { innerText: "query:"},
                                inputView,
                                { class:'fas fa-play fv-pointer fv-hover-bg-background-alt p-2',
                                  onclick: () => this.query$.next(stateInput.value$.getValue())
                                }
                            ]
                        },
                        { innerText: 'e.g. library_name=lodash@bundle,library_id,library_name#20'}
                    ]
                },
                {
                    tag: 'table', class: 'fv-color-primary mx-auto text-center my-2',
                    children: [
                        {
                            tag: 'thead',
                            children: [
                                {
                                    tag: 'tr', class: 'fv-bg-background-alt',
                                    children: keys.map( key => {
                                        return { tag: 'td', class: "px-3", innerText: key }
                                    })
                                }
                            ]
                        },
                        {
                            tag: 'tbody',
                            children: documents
                                .map((doc:any) => {
                                    let values = Object.values(doc)
                                    return {
                                        tag: 'tr',
                                        class: 'fv-pointer fv-hover-bg-background-alt',
                                        children: values.map( (value) => { 
                                            return { tag: 'td', class: "px-3", innerText: value }
                                        })
                                    }
                                })
                        }
                    ]

                }
            ]
        }
    }

}