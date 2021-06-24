import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { Status as DocDbStatus} from '../redis/redis.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


let titles = {
    [PanelId.DocDbGeneral] :'General'
}

export class DocDbState implements PackageState{

    status$  :  Observable<DocDbStatus>
    
    childrenPanels$ = new BehaviorSubject([PanelId.DocDbGeneral])

    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){

        this.status$ = Backend.docdb.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {return []}

}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: DocDbState){
        super( PanelId.DocDbGeneral, titles[PanelId.DocDbGeneral])
    }
    view() {
        return new HelmTabView(this.state, Backend.docdb)
    }
}


export class DocDbView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : DocDbState
    
    constructor(state:DocDbState){

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