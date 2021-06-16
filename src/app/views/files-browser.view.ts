import { child$, children$, render, VirtualDOM } from "@youwol/flux-view"
import { Modal } from "@youwol/fv-group"
import { BehaviorSubject, Subject } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { Backend } from "../backend/router"

class ModalState extends Modal.State{

    startingFolder: Array<string>

    constructor(public readonly configurationPath: Array<string>){
        super()
        this.startingFolder = configurationPath.slice(0,-1)
    }
}


export function popupFilesBrowserView(
    {fromPath, onSelected}: {fromPath: string, onSelected: (any) => void } /*environment: Environment*/) {

    let state = new ModalState(fromPath.split('/'))
    let view = new Modal.View({ state, contentView })
    let modalDiv = render(view)
    document.querySelector("body").appendChild(modalDiv)

    state.ok$.subscribe((ev) => {
        onSelected(ev['data'])
        modalDiv.remove()
    })
    state.cancel$.subscribe(() => modalDiv.remove())
}

function contentView(state: ModalState){

    let folderSelected$ = new BehaviorSubject<Array<string>>(state.startingFolder)
    let items$ = folderSelected$.pipe(
        mergeMap( (path) => Backend.environment.folderContent$(path))
    )
    return {
        class:'fv-bg-background fv-text-primary border rounded p-4',
        style:{"width":"50vw", "height":"50vh", overflow:'auto'},
        children: [
            {
                class: 'd-flex',
                children: children$(
                    folderSelected$,
                    (paths: Array<string>) => paths.map( (element) => pathElementView(folderSelected$, element))
                )
            },
            {   class: 'my-4',
                children: children$(
                    items$,
                    ({configurations, files, folders}) => {
                        
                        let configsVDom= configurations.map( name => {
                            return configView(folderSelected$, name, state.configurationPath, state.ok$) 
                        })
                        let filesVDom= files.map( name => fileView(name))
                        let foldersVDom= folders.map( name => folderView(folderSelected$, name))
                        return [ ...configsVDom, ...foldersVDom, ...filesVDom]
                    })
            }
        ]
    }
}

function pathElementView(folderSelected$: BehaviorSubject<Array<string>>, element: string): VirtualDOM {
    let index = folderSelected$.getValue().indexOf(element)
    
    return { 
        class:'px-2 fv-pointer fv-hover-bg-background-alt border rounded mx-2', 
        innerText: element,
        onclick: () => folderSelected$.next(folderSelected$.getValue().slice(0,index+1))
    
    }
}

function configView(folderSelected$: BehaviorSubject<Array<string>>, name:string,  currentConf: Array<string>, ok$: Subject<MouseEvent>): VirtualDOM{

    let currentFolder = folderSelected$.getValue()
    return { 
        class:'fv-pointer d-flex  align-items-center fv-hover-bg-background-alt fv-text-focus', 
        style: { 'font-weight': JSON.stringify(currentFolder.concat(name)) === JSON.stringify(currentConf) ? 'bolder': 'inherit'},
        children: [
            { class: 'fas fa-file px-2'},
            { innerText: name }
        ],
        onclick: (ev) =>  {
            ev.data = [...folderSelected$.getValue(), name]
            ok$.next(ev)
            //GeneralState.switchConfiguration([...folderSelected$.getValue(), name] ) 
        }
    }
}

function fileView( name:string): VirtualDOM{

    return { 
        class:'d-flex  align-items-center fv-text-disabled', 
        style:{"user-select": 'none'},
        children: [
            { class: 'fas fa-file px-2'},
            { innerText: name }
        ]
    }
}

function folderView(folderSelected$: BehaviorSubject<Array<string>>, name:string): VirtualDOM{

    return { 
        class:'fv-pointer d-flex align-items-center fv-hover-bg-background-alt', 
        children: [
            { 
                class: 'fas fa-folder px-2'
            },
            { 
                innerText:  name, 
                onclick: ()=>folderSelected$.next( folderSelected$.getValue().concat(name)) 
            }
        ]
    }
}