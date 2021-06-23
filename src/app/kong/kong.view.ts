import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralView } from './general.view'
import { Status as KongStatus} from './kong.router'
import { KongAdminView } from './kong-admin.view'
import { Package } from '../environment/models'
import { PackageState } from '../models'


let titles = {
    [PanelId.KongGeneral] :'General',
    [PanelId.KongAdmin] :'Kong admin'
}

export class KongState implements PackageState {

    status$ : Observable<KongStatus>
    childrenPanels$ = new BehaviorSubject([PanelId.KongGeneral, PanelId.KongAdmin])
    
    constructor(
        public readonly pack: Package,
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){
            this.status$ = Backend.kong.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: KongState){
        super( PanelId.KongGeneral, titles[PanelId.KongGeneral])
    }
    view() {
        return new GeneralView(this.state)
    }
}

class KongAdminTabData extends Tabs.TabData{
    
    constructor(public readonly kongAdminState){
        super( PanelId.KongAdmin, titles[PanelId.KongAdmin])
    }
    view() {
        return new KongAdminView(this.kongAdminState)
    }
}



export class KongView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : KongState
    
    static children$ = new BehaviorSubject([
        PanelId.KongGeneral,
        PanelId.KongAdmin
    ])

    constructor(state:KongState){

        let tabsData = [
            new GeneralTabData(state),
            new KongAdminTabData(state),            
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