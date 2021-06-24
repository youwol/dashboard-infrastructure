import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as CDNStatus} from '../redis/redis.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


export class CDNState implements PackageState{

    status$  :  Observable<CDNStatus>
    
    childrenPanels$ = new BehaviorSubject([PanelId.CDNGeneral])

    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){

        this.status$ = Backend.cdn.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {return []}

}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: CDNState){
        super( PanelId.CDNGeneral, tabsDisplayInfo[PanelId.CDNGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.cdn)
    }
}


export class CDNView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : CDNState
    
    constructor(state:CDNState){

        let tabsData = [
            new GeneralTabData(state)            
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