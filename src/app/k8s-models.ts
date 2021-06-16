

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
