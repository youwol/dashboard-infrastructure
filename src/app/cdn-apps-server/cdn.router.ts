import { Observable, ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"
import { Backend } from "../backend/router"


export interface Status {

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class CdnAppsServerRouter {

    private static urlBase = '/api/youwol-infra/cdn-apps-server'

    public static webSocket$: ReplaySubject<any>
    public static statusDict$: { [key: string]: ReplaySubject<Status> } = {}

    static headers = {}

    static triggerStatus(namespace: string) {

        let r = new Request(`${CdnAppsServerRouter.urlBase}/${namespace}/status`, { headers: CdnAppsServerRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body) {

        let r = new Request(`${CdnAppsServerRouter.urlBase}/${namespace}/install`,
            { method: 'POST', body: JSON.stringify(body), headers: CdnAppsServerRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body) {

        let r = new Request(`${CdnAppsServerRouter.urlBase}/${namespace}/upgrade`,
            { method: 'POST', body: JSON.stringify(body), headers: CdnAppsServerRouter.headers })
        fetch(r).then()
    }
}
