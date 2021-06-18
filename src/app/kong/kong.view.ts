import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralState, GeneralView } from './general.view'
import { Status as KongStatus} from '../backend/kong.router'
import { KongAdminState, KongAdminView } from './kong-admin.view'


let titles = {
    [PanelId.KongGeneral] :'General',
    [PanelId.KongAdmin] :'Kong admin'
}

export class KongState{

    status$ = new Subject<KongStatus>()

    generalState = new GeneralState()
    kongAdminState = new KongAdminState()
    
    constructor(public readonly selectedPanel$: BehaviorSubject<PanelId>){
        Backend.kong.connectWs()
        this.status$ = Backend.kong.status$
        this.status$.subscribe( status => {
            console.log(status)
        })
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.KongGeneral, titles[PanelId.KongGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
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
    
    constructor(state:KongState){

        let tabsData = [
            new GeneralTabData(state.generalState),
            new KongAdminTabData(state.kongAdminState),            
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