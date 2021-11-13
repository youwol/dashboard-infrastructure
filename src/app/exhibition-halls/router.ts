import { ReplaySubject } from "rxjs"
import { SanityEnum } from "../models"


export interface Status {

    installed: boolean
    sanity: SanityEnum
    pending: boolean
}


export class ExhibitionHallsRouter {

    private static urlBase = '/api/youwol-infra/exhibition-halls'

    public static webSocket$: ReplaySubject<any>
    public static statusDict$: { [key: string]: ReplaySubject<Status> } = {}

    static headers = {}

    static triggerStatus(namespace: string) {

        let r = new Request(`${ExhibitionHallsRouter.urlBase}/${namespace}/status`, { headers: ExhibitionHallsRouter.headers })
        fetch(r).then()
    }

    static triggerInstall(namespace: string, body) {

        let r = new Request(`${ExhibitionHallsRouter.urlBase}/${namespace}/install`,
            { method: 'POST', body: JSON.stringify(body), headers: ExhibitionHallsRouter.headers })
        fetch(r).then()
    }

    static triggerUpgrade(namespace: string, body) {

        let r = new Request(`${ExhibitionHallsRouter.urlBase}/${namespace}/upgrade`,
            { method: 'POST', body: JSON.stringify(body), headers: ExhibitionHallsRouter.headers })
        fetch(r).then()
    }
}
