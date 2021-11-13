import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


export class StoriesState extends PackageState {

    childrenPanels$ = new BehaviorSubject([PanelId.StoriesGeneral])

    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
    ) {
        super(pack, selectedPanel$, Backend.stories)
    }
}

class GeneralTabData extends Tabs.TabData {

    constructor(public readonly state: StoriesState) {
        super(PanelId.StoriesGeneral, tabsDisplayInfo[PanelId.StoriesGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.stories)
    }
}


export class StoriesView implements VirtualDOM {

    public readonly tag = 'div'
    public readonly children: Array<VirtualDOM>
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state: StoriesState

    constructor(state: StoriesState) {

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
