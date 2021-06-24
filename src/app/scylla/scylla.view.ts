import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as ScyllaStatus} from './scylla.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { ExplorerView } from './explorer.view'
import { HelmTabView } from '../helm/helm.view'



export class ScyllaState implements PackageState{

    status$ : Observable<ScyllaStatus>

    childrenPanels$ = new BehaviorSubject([PanelId.ScyllaGeneral,PanelId.ScyllaExplorer])

    constructor(
        public readonly pack: Package, 
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){
        this.status$ = Backend.scylla.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: ScyllaState){
        super(PanelId.ScyllaGeneral, tabsDisplayInfo[PanelId.ScyllaGeneral].title )
    }

    view() {
        return new HelmTabView(this.state, Backend.scylla)
    }
}


class ExplorerTabData extends Tabs.TabData{
    
    constructor(public readonly state: ScyllaState){
        super(PanelId.ScyllaExplorer, tabsDisplayInfo[PanelId.ScyllaExplorer].title )
    }
    
    view() {
        return new ExplorerView(this.state)
    }
}



export class ScyllaView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : ScyllaState
    
    constructor(state:ScyllaState){

        let tabsData = [
            new GeneralTabData(state),
            new ExplorerTabData(state)            
        ]
        
        this.children = [
            new Tabs.View({
                class:'d-flex flex-column h-100', 
                state: new Tabs.State(tabsData, state.selectedPanel$ ),
                headerView: (state, tab) => ({innerText: tab.name, class:'px-2'}),
                contentView: (tabState, tabData) => tabData.view()
            } as any)
        ]
    }
}