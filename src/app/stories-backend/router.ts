import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status {

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class StoriesBackendRouter {

    private static urlBase = '/api/youwol-infra/stories-backend'

    public static webSocket$: ReplaySubject<any>
    public static statusDict$: { [key: string]: ReplaySubject<Status> } = {}

    static headers = {}

    static triggerStatus(namespace: string) {

        let r = new Request(`${StoriesBackendRouter.urlBase}/${namespace}/status`, { headers: StoriesBackendRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body) {

        let r = new Request(`${StoriesBackendRouter.urlBase}/${namespace}/install`,
            { method: 'POST', body: JSON.stringify(body), headers: StoriesBackendRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body) {

        let r = new Request(`${StoriesBackendRouter.urlBase}/${namespace}/upgrade`,
            { method: 'POST', body: JSON.stringify(body), headers: StoriesBackendRouter.headers })
        fetch(r).then()
    }
}
