import { k8s } from "../k8s-models"
import { DataTreeView } from "../views/data-tree.view"
import { Environment } from "./models"


export function clusterSummary(environment: Environment){
    
    let state =  new DataTreeView.State({
        title:'raw data',
        data:environment
    })
    
    return {
        class: 'flex-grow-1  p-2',
        children: [
            {
                class:'d-flex',
                children:[
                    {
                        innerText: "K8s context"
                    },
                    {   class:'px-2 fv-text-focus',
                        innerText: environment.deploymentConfiguration.general.contextName
                    },
                ]
            },
            {
                tag:'hr', class:'fv-color-primary'
            },
            {
                class:'d-flex',
                children:[
                    {
                        innerText: "Access token"
                    },
                    {   class:'px-2 fv-text-focus',
                        innerText: environment.clusterInfo.accessToken
                    },
                ]
            },
            {
                tag:'hr', class:'fv-color-primary'
            },
            {
                children:[
                    {
                        innerText: "Nodes"
                    },
                    nodesTableView(environment.clusterInfo.nodes),
                ]
            },
            new DataTreeView.View({state, class:'h-100 overflow-auto'} as any)
        ]
    }
}

function nodesTableView(nodes: Array<k8s.Node> ){

    return {
        tag: 'table', class: 'fv-color-primary mx-auto text-center my-2',
        style: { 'max-height': '100%' },
        children: [
            {
                tag: 'thead',
                children: [
                    {
                        tag: 'tr', class: 'fv-bg-background-alt',
                        children: [
                            { tag: 'td', class:"px-3", innerText: 'cpu' },
                            { tag: 'td', class:"px-3", innerText: 'memory' },
                            { tag: 'td', class:"px-3", innerText: 'architecture' },
                            { tag: 'td', class:"px-3", innerText: 'kernel version' },
                            { tag: 'td', class:"px-3", innerText: 'operating system' },
                            { tag: 'td', class:"px-3", innerText: 'os image' }
                        ]
                    }
                ]
            },
            {
                tag: 'tbody',
                children: nodes
                    .map((node: k8s.Node) => {
                        return {
                            tag: 'tr',
                            children: [
                                { tag: 'td', class:"px-3",innerText: node.capacity.cpu },
                                { tag: 'td', class:"px-3",innerText: node.capacity.memory },
                                { tag: 'td', class:"px-3", innerText: node.nodeInfo.architecture },
                                { tag: 'td', class:"px-3", innerText: node.nodeInfo.kernelVersion },
                                { tag: 'td', class:"px-3", innerText: node.nodeInfo.operatingSystem },
                                { tag: 'td', class:"px-3", innerText: node.nodeInfo.osImage }
                            ]
                        }
                    })
            }
        ]

    }
}