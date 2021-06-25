import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as KeycloakStatus} from '../redis/redis.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


export class KeycloakState extends PackageState{

    childrenPanels$ = new BehaviorSubject([PanelId.KeycloakGeneral])

    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.keycloak)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: KeycloakState){
        super( PanelId.KeycloakGeneral, tabsDisplayInfo[PanelId.KeycloakGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.keycloak)
    }
}


export class KeycloakView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : KeycloakState
    
    constructor(state:KeycloakState){

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