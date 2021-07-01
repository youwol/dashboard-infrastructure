import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject } from 'rxjs'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'
import { Backend } from '../backend/router'


export class FrontApiState extends PackageState{

    childrenPanels$ = new BehaviorSubject([PanelId.FrontApiGeneral])

    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.frontApi)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: FrontApiState){
        super( PanelId.FrontApiGeneral, tabsDisplayInfo[PanelId.FrontApiGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.frontApi)
    }
}


export class FrontApiView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : FrontApiState
    
    constructor(state:FrontApiState){

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