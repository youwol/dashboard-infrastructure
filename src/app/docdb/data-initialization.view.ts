import { attr$, child$, HTMLElement$, VirtualDOM } from "@youwol/flux-view"
import { button, innerTabClasses } from "../utils-view"
import { DocDbRouter, LocalTable, tableId } from "./docdb.router"
import { DocDbState } from "./docdb.view"
import { filter, mergeMap, withLatestFrom } from "rxjs/operators"
import { BehaviorSubject, Observable } from "rxjs"
import { Package } from "../environment/models"
import { Backend } from "../backend/router"

class State{

    public readonly  syncId = String(Math.floor(Math.random() * 1e6))

    public readonly currentFolder$ = new BehaviorSubject<string>("")

    public readonly toggledTables$ = new BehaviorSubject<LocalTable[]>([])

    public readonly progressEvent$ : Observable<{progress:number, operationId:string}>
    

    constructor(public readonly pack: Package){

        this.progressEvent$ = Backend.channel$(this.pack.name, this.pack.namespace, "Docdb.SyncLocalData").pipe(
            filter( message => message.operationId==this.syncId)
        )
    }

    setCurrentFolder(path){
        this.currentFolder$.next(path)
    }

    toggleTable(table: LocalTable){
        let oldList = this.toggledTables$.getValue()
        let newList = oldList.filter( t => tableId(t) != tableId(table))
        newList = oldList.length == newList.length 
            ? newList.concat(table) 
            : newList
        this.toggledTables$.next(newList)
    }

    toggleAll(tables){
        this.toggledTables$.next(tables)
    }

    unToggleAll(){
        this.toggledTables$.next([])
    }

    synchronize(){
        let body = {
            operationId:this.syncId,
            tables: this.toggledTables$.getValue(),
            folder: this.currentFolder$.getValue()
        }
        DocDbRouter.synchronizeLocalTables(this.pack.namespace, body)        
    }
}

export class InitializationView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = innerTabClasses

    private readonly validateFolderBtn = button("fas fa-check", "Ok")
    private readonly syncBtn = button("fas fa-lightning", "Sync")

    private readonly state : State 

    connectedCallback: (d: HTMLElement$) => void
    
    constructor(public readonly globalState: DocDbState) {
        
        this.state = new State(globalState.pack)

        this.children = [
            this.folderSelectView(),
            child$( 
                this.validateFolderBtn.state.click$.pipe(
                    withLatestFrom( this.state.currentFolder$ ),
                    mergeMap( ([, folder]) => DocDbRouter.getLocalDocDbTables({folder}))
                ),
                ( tables ) => this.tablesListView(tables)
                ),
            child$(
                this.state.toggledTables$.pipe(
                    filter( tables => tables.length>0)
                ),
                () => this.syncBtn
            ),
            child$(
                this.state.progressEvent$,
                ({progress}) => this.progressView(progress)
            ),
        ]
        this.connectedCallback = (elem: HTMLElement$) => {
            elem.ownSubscriptions(
                this.syncBtn.state.click$.subscribe(() =>this.state.synchronize())
            )
        }
    }

    folderSelectView() : VirtualDOM{
        return {   
            class: 'd-flex w-100',
            children:[
                {
                    tag: 'input',
                    class: 'flex-grow-1',
                    type: "text",
                    placeholder: 'Paste the path to the local docdb folder to copy',
                    onchange : (event) => this.state.setCurrentFolder(event.target.value)
                },
                this.validateFolderBtn
            ]
        }
    }

    tablesListView( tables : LocalTable[]): VirtualDOM{
        
        let checkBox = (table:LocalTable) => ({
            tag:'input',
            type:'checkbox',
            checked: attr$(
                this.state.toggledTables$,
                (tables) => tables.find( (t) => tableId(t) == tableId(table) ) != undefined 
            ),
            onclick: () => this.state.toggleTable(table)
        })

        return {
            tag: 'table', class: 'fv-color-primary mx-auto text-center my-2',
            children: [
                {
                    tag: 'thead',
                    children: [
                        {
                            tag: 'tr', class: 'fv-bg-background-alt',
                            children: [ 
                                { tag: 'td', class: "px-3", innerText: "keyspace" }, 
                                { tag: 'td', class: "px-3", innerText: "name" }, 
                                { tag: 'td', class: "px-3", 
                                  children: [
                                        {
                                            class:'fas fa-check p-1 fv-hover-bg-background fv-pointer',
                                            onclick: () => this.state.toggleAll(tables)
                                        },
                                        {
                                            class:'fas fa-times p-1 fv-hover-bg-background fv-pointer',
                                            onclick: () => this.state.unToggleAll()
                                        }
                                    ]
                                }, 
                            ]
                        }
                    ]
                },
                {
                    tag: 'tbody',
                    children: tables.map((table: LocalTable) => {
                            return {
                                tag: 'tr',
                                class: 'fv-pointer fv-hover-bg-background-alt',
                                children: [
                                    { tag: 'td', class: "px-3", innerText: table.keyspace },
                                    { tag: 'td', class: "px-3", innerText: table.name },
                                    checkBox(table)
                                ]
                            }
                        })
                }
            ]

        }
    }

    progressView(progress: number): VirtualDOM {

        return {
            class:"w-100 my-3",
            children:[
                {
                    innerText:'Progress:'
                },
                {
                    class:"w-100 fv-bg-background-alt",
                    style:{
                        position:'relative',
                        height: "5px"
                    },
                    children:[
                        {
                            class:"fv-bg-success",
                            style:{
                                position:'absolute',
                                height: "5px",
                                width: `${Math.floor(progress*100)}%`
                            }
                        }
                    ]
                }
            ]
        }
    }
    
}