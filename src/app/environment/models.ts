import {k8s} from '../k8s-models'

export interface K8sContext{

    name: string
}



export interface ClusterInfo{

    accessToken: string
    nodes: Array<k8s.Node>
}

export interface Environment {

    clusterInfo: ClusterInfo
    configFilepath: string
    deploymentConfiguration: any
}

export function instanceOfEnvironment(object: any): object is Environment{

    return object.clusterInfo && object.deploymentConfiguration
}
