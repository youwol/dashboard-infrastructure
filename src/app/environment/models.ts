import {k8s} from '../models'

export interface K8sContext{

    name: string
}



export interface ClusterInfo{

    accessToken: string
    nodes: Array<k8s.Node>
    k8sApiProxy: string
}

export interface Package{
    name: string
    namespace: string
    icon: string
}

export interface DeploymentConfiguration{

    general: any
    packages: Array<Package>
}


export interface Environment {

    clusterInfo: ClusterInfo
    configFilepath: string
    deploymentConfiguration: DeploymentConfiguration
}

export function instanceOfEnvironment(object: any): object is Environment{

    return object.clusterInfo && object.deploymentConfiguration
}
