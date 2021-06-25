import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { Backend } from "./backend/router";
import { Package } from "./environment/models";
import { PanelId } from "./panels-info";



export enum SanityEnum{

    SANE = "SANE",
    WARNINGS = "WARNINGS",
    BROKEN = "BROKEN",
    PENDING = "PENDING"
}

export interface DeploymentStatus{

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export interface Selection{
    package: Package
    panel: PanelId
}

export abstract class PackageState{
    
    
    childrenPanels$: BehaviorSubject<PanelId[]>
    status$: Observable<DeploymentStatus>

    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>,
        public readonly Router: any
        ){
            this.status$ = Backend.channel$(pack.name, pack.namespace)
            Router.triggerStatus(pack.namespace)
        }

    subscribe() : Subscription[] {
        return []
    }
}


export function instanceOfDeploymentStatus( message ) : message is DeploymentStatus{
    return message.installed != undefined && message.pending != undefined
}

export namespace k8s{

    export interface Capacity{
        cpu: string
        memory: string
    }


    export interface NodeInfo{
        architecture: string
        kernelVersion: string
        operatingSystem: string
        osImage: string
    }


    export interface Node{

        capacity: Capacity
        nodeInfo: NodeInfo
    }

}
