import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralView } from './general.view'
import { Status as StorageStatus} from './storage.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'


let titles = {
    [PanelId.StorageGeneral] :'General'
}

export class StorageState implements PackageState{

    status$ : Observable<StorageStatus>
    childrenPanels$ = new BehaviorSubject([PanelId.StorageGeneral])

    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>
    ){
        this.status$ = Backend.storage.watch(pack.namespace)
    }

    subscribe(): Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: StorageState){
        super( PanelId.StorageGeneral, titles[PanelId.StorageGeneral])
    }
    view() {
        return new GeneralView(this.state)
    }
}


export class StorageView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : StorageState
    
    constructor(state:StorageState){

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