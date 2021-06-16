


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
