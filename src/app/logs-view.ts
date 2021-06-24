import { childrenAppendOnly$, VirtualDOM } from "@youwol/flux-view";
import { ImmutableTree } from "@youwol/fv-tree";
import { merge, Observable, of } from "rxjs";
import { filter, map, scan, tap } from "rxjs/operators";
import { Backend } from "./backend/router";



export enum Action{
    INSTALL = 'INSTALL',
    BUILD = 'BUILD',
    TEST = 'TEST',
    CDN = 'CDN',
    SYNC = 'SYNC',
    SERVE = 'SERVE',
}

export enum ActionScope{
    TARGET_ONLY = "TARGET_ONLY",
    ALL_ABOVE = "ALL_ABOVE",
    ALL_BELOW = "ALL_BELOW",
    ALL = "ALL"
}

export enum LogLevel {

    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}

export enum ActionStep{

    STARTED = "STARTED",
    PREPARATION = "PREPARATION",
    STATUS = "STATUS",
    RUNNING = "RUNNING",
    PACKAGING = "PACKAGING",
    DONE = "DONE"
}


export class LogMessage {

    text: string
    level: LogLevel
    json: any
    contextId: string = undefined
    children: Array<LogMessage> = []

    constructor({ text, level, json, contextId}:
        { text: string, level: LogLevel,json:any, contextId?: string}){

            this.text = text
            this.level = level
            this.json = json
            this.contextId= contextId
    }
}


export class LogsState{

    logs$: Observable<LogMessage> = Backend.logs.logs$
    
    constructor(){
        
        Backend.logs.connectWs()
    }
}


export class LogDataNode extends ImmutableTree.Node{

    name: string
    data: Object
    constructor( {name, data}: {name:string, data:Object}) {
        super({ id: `${Math.floor(Math.random()*1e6)}` ,
                children: LogDataNode.getChildren(data)
            })
        this.name = name
        this.data = data
    }

    static getChildren(data){
        let isObject = data!=null && data!=undefined && typeof(data)!='string' &&  typeof(data)!='number' &&  typeof(data)!='boolean'
        return isObject
        ? of(Object.entries(data).map( ([k,v])=> new LogDataNode({name:k,data:v}) ))
        : undefined
    }
}

let icons = {
    [ActionStep.STATUS] : 'fas fa-info',
    [ActionStep.STARTED] : 'fas fa-play',
    [ActionStep.PREPARATION] : 'fas fa-running',
    [ActionStep.RUNNING] : 'fas fa-running',
    [ActionStep.PACKAGING] : 'fas fa-archive',
    [ActionStep.DONE] : 'far fa-flag'
}
export class LogsView implements VirtualDOM{

    class = 'h-25 d-flex flex-column'

    children: Array<VirtualDOM>

    state: LogsState

    constructor(){
        this.state = new LogsState()
        this.children = [
            //this.header(),
            this.content()
        ]
    }


    header(): VirtualDOM {

        return {   
            tag:'hr', 
            class:'fv-color-primary w-100'
            }
    }

    content(): VirtualDOM{

        return {
            class:' fv-bg-background-alt flex-grow-1 overflow-auto d-flex flex-column',
            children: childrenAppendOnly$(
                this.state.logs$
                .pipe(
                    map( m => [new LogMessage(m)]),
                    filter( ([m]) => m.level != LogLevel.DEBUG )
                    ),
                (message) => this.messageView(message),
                {
                    sideEffects: (elem) => elem.scrollTop = elem.scrollHeight
                }
            )
        }
    }

    messageView( message: LogMessage): VirtualDOM {

        let jsonView = message.json ? this.jsonView(message.json) : {}
        
        return {
            class: 'd-flex align-items-center my-1 '+ (message.level==LogLevel.ERROR ? 'fv-text-error fv-bg-on-error' : 'fv-text-primary'),
            children:[
                {   class:'px-2 d-flex align-items-center',
                    children: [
                        {   class: "mx-2",
                            innerHTML: message.text
                        },
                        jsonView
                    ]
                }
            ]
        }
    }

    jsonView( data) : VirtualDOM{

        let rootNode = new LogDataNode({name:'data', data})
        let treeState = new ImmutableTree.State({rootNode})
        let headerView = ( state: ImmutableTree.State<LogDataNode>, node:LogDataNode) => {
            let title =  { innerText: node.name } 
            return node.children 
            ? title
            : { class: 'd-flex align-items-baseline',
                children:[
                    title,
                    {   tag:'i', class:'px-2', innerText:node.data}
                ]
            }
        }
        let view = new ImmutableTree.View({state: treeState, headerView})
        return view
    }
}
