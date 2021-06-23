import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralView } from './general.view'
import { K8sDashboardRouter, Status as K8sDashboardStatus } from './k8s-dashboard.router'
import { Package } from '../environment/models'
import { PackageState } from '../models'
import { filter, mergeMap, take } from 'rxjs/operators'
import { EnvironmentRouter } from '../environment/environment.router'


let titles = {
    [PanelId.K8sDashboardGeneral]: 'General'
}

export class K8sDashboardState implements PackageState {

    status$ : Observable<K8sDashboardStatus>
    childrenPanels$ = new BehaviorSubject<PanelId[]>([PanelId.K8sDashboardGeneral])

    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>
    ) {
        this.status$ = Backend.k8sDashboard.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData {

    constructor(public readonly generalState) {
        super(PanelId.K8sDashboardGeneral, titles[PanelId.K8sDashboardGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}



export class K8sDashboardView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state: K8sDashboardState

    constructor(state: K8sDashboardState) {

        let tabsData = [
            new GeneralTabData(state)
        ]

        this.children = [
            new Tabs.View({
                class: 'd-flex flex-column h-100',
                state: new Tabs.State(tabsData, state.selectedPanel$),
                headerView: (state, tab) => ({ innerText: tab.name, class: 'px-2' }),
                contentView: (tabState, tabData) => tabData.view()
            } as any)
        ]
    }
}