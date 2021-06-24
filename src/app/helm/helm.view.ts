import { child$, VirtualDOM } from "@youwol/flux-view";
import { ExpandableGroup } from "@youwol/fv-group";
import { ImmutableTree } from "@youwol/fv-tree";
import { Subject } from "rxjs";
import { FindValueSubscriber } from "rxjs/internal/operators/find";
import { mergeMap } from "rxjs/operators";
import { HelmPackage, Package } from "../environment/models";
import { DataTreeView } from "../views/data-tree.view";
import {HelmRouter} from './helm.router'


class ChartNode extends ImmutableTree.Node{

    name: string

    constructor({id, name, children}){
        super({id, children})
        this.name = name
    }
}
class FileNode extends ChartNode{

    constructor({id, name}){
        super({id, name, children: undefined})
    }
}

class FolderNode extends ChartNode{

    static getChildren( data, id ) {
        let foldersNode = data[id].folders.map( (folder) => {
            return new FolderNode({id:folder.path,name:folder.name,data})
        })
        let filesNode = data[id].files.map( (file) => {
            return new FileNode({id:file.path,name:file.name})
        })
        return [...foldersNode,...filesNode]
    }

    constructor({id, name, data}){
        super({id, name, children:FolderNode.getChildren(data, id)})
    }
}


export function helmView(
    status: {installed:boolean},
    pack: HelmPackage,
    router: any): VirtualDOM{

    console.log("Pack", pack)
    return {
        class:'h-100',
        children:[
            installUpgradeView(status, router),
            {
                tag: 'hr', class: 'fv-color-primary'
            },
            valuesView(pack.withValues),
            {
                tag: 'hr', class: 'fv-color-primary'
            },
            helmChartExplorerView(pack.name, pack.namespace)
        ]
    }
}


function installUpgradeView(
    {installed} : {installed:boolean},
    router: any
    ): VirtualDOM{

    return {
        class: 'd-flex align-items-center',
        children:[
            {
                class: 'fv-pointer p-2 border rounded fv-text-focus fv-hover-bg-background-alt my-auto',
                innerText: installed ? 'Upgrade' : 'Install',
                style: {width:'fit-content'},
                onclick: (ev) => {
                    installed 
                        ? router.triggerUpgrade(this.state.pack.namespace, {values:{}})
                        : router.triggerInstall(this.state.pack.namespace, {values:{}})
                }
            },
            {
                innerText: " Helm additional args: ",
                class: 'mx-4'
            },
            {
                class:"flex-grow-1 h-100 py-1", 
                style: {'font-size': 'small'},
                connectedCallback: (elem) => {     
                    let config = {
                        value: "",
                        theme: "blackboard",
                        lineNumbers: false
                    }
                    let cm = window['CodeMirror'](elem,config)
                    cm.setSize("100%","100%")
                }
            }
        ]
    }
}



function valuesView(withValues): VirtualDOM{

    let contentView = () => {
        
        let state = new DataTreeView.State({
            title: 'values',
            data: withValues
        })
        let view= new DataTreeView.View({ state } as any)
        return {
            class: 'p-3 border ',
            children:[
                view
            ]
        }
    }
    let stateGrp = new ExpandableGroup.State("Overridden values (from configuration file)", false)

    let view = new ExpandableGroup.View({
        state:stateGrp,
        headerView: ExpandableGroup.defaultHeaderView,
        contentView
    }as any)

    return view
}


function helmChartExplorerView(name, namespace): VirtualDOM{

    let state = new ExpandableGroup.State("Original helm chart", false)

    let selectedFile$ = new Subject<FileNode>()

    let contentView = () => ({
        class: 'd-flex w-100 h-50 justify-content-around p-3 border ',
        children:[
            {
                class:'w-25',
                children:[
                    child$(
                        HelmRouter.chart$(name, namespace),
                        (resp) => {
                            let state = new ImmutableTree.State<ChartNode>({
                                rootNode: new FolderNode({id:'.', name:'.', data:resp}),
                                expandedNodes:['.']
                            })
                            let view = new ImmutableTree.View({
                                state,
                                headerView: (state, node:ChartNode) => headerView(node, selectedFile$)
                            })
                            return view
                        }
                    )
                ]
            },
            {   class:'w-75 h-100',
                children:[
                    child$(
                        selectedFile$.pipe(
                            mergeMap( (fileNode: FileNode) => {
                                return HelmRouter.file$(name, namespace, fileNode.id)
                            })
                        ),
                        (content) => {
                            return {
                                class:"flex-grow-1 w-100 h-100 py-1", 
                                style: {'font-size': 'small'},
                                connectedCallback: (elem) => {  
                                    let config = {
                                        value: content,
                                        mode:  "yaml",
                                        theme: "blackboard",
                                        lineNumbers: true
                                    }
                                    let cm = window['CodeMirror'](elem,config)
                                    cm.setSize("100%","100%")
                                }
                            }
                        }
                    )
                ]
                
            }
        ]
    })

    let view = new ExpandableGroup.View({
        state,
        headerView: ExpandableGroup.defaultHeaderView,
        contentView,
        class:'h-100'
    }as any)
    return view
}



function headerView(node: ChartNode, selectedFile$: Subject<FileNode>){
    if( node instanceof FileNode) {
        return helmFileView(node, selectedFile$)
    }
    return helmFolderView(node)
}

function helmFolderView(node: FileNode){

    return {
        class:'d-flex align-items-center',
        children:[
            {
                class:'fas fa-folder px-2'
            },
            {
                innerText: node.name
            }
        ]
    }
}
function helmFileView(node: FileNode, selectedFile$: Subject<FileNode>){

    return {
        class:'fv-hover-bg-background-alt fv-pointer d-flex align-items-center ',
        onclick: () => selectedFile$.next(node), 
        children:[
            {
                class:'fas fa-file px-2'
            },
            {
                innerText: node.name
            }
        ]
    }
}