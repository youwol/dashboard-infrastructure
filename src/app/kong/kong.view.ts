import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { Status as KongStatus} from './kong.router'
import { KongAdminView } from './kong-admin.view'
import { Package } from '../environment/models'
import { PackageState } from '../models'
import { HelmTabView } from '../helm/helm.view'
import { KongAcmeView } from './kong-acme.view'


let titles = {
    [PanelId.KongGeneral] :'General',
    [PanelId.KongAdmin] :'Kong admin'
}

export class KongState extends PackageState {

    childrenPanels$ = new BehaviorSubject([PanelId.KongGeneral, PanelId.KongAdmin,  PanelId.KongAcme])
    
    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.kong)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: KongState){
        super( PanelId.KongGeneral, titles[PanelId.KongGeneral])
    }
    view() {
        return new HelmTabView(this.state,Backend.kong)
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

class KongAcmeTabData extends Tabs.TabData{
    
    constructor(public readonly kongAdminState){
        super( PanelId.KongAcme, titles[PanelId.KongAcme])
    }
    view() {
        return new KongAcmeView(this.kongAdminState)
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
            new KongAcmeTabData(state),           
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