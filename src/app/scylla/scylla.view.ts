import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralView } from './general.view'
import { Status as ScyllaStatus} from './scylla.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'


let titles = {
    [PanelId.ScyllaGeneral] :'General'
}

export class ScyllaState implements PackageState{

    status$ : Observable<ScyllaStatus>

    childrenPanels$ = new BehaviorSubject([PanelId.ScyllaGeneral])

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
        super( PanelId.ScyllaGeneral, titles[PanelId.ScyllaGeneral])
    }
    view() {
        return new GeneralView(this.state)
    }
}


export class ScyllaView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : ScyllaState
    
    constructor(state:ScyllaState){

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