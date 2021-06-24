
import { createObservableFromFetch, createTextObservableFromFetch } from "../backend/router"



export class HelmRouter{

    private static urlBase = '/api/youwol-infra/helm/charts'
    static headers = {}


    static chart$(name: string, namespace:string) {

        let r = new Request( `${HelmRouter.urlBase}/${name}/namespaces/${namespace}/`, { headers: HelmRouter.headers })
        return createObservableFromFetch(r)
    }

    static file$(name: string, namespace:string, path: string) {

        let r = new Request( `${HelmRouter.urlBase}/${name}/namespaces/${namespace}/files/${path}`, { headers: HelmRouter.headers })
        return createTextObservableFromFetch(r)
    }
}