import { BehaviorSubject, Observable, Subject } from "rxjs";
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

export interface PackageState{
    pack: Package
    selectedPanel$: Subject<PanelId>
    childrenPanels$: BehaviorSubject<PanelId[]>
    status$: Observable<DeploymentStatus>
    subscribe()
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
