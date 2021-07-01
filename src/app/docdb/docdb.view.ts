import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as DocDbStatus} from '../redis/redis.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'
import { ExplorerView } from './explorer.view'


let titles = {
    [PanelId.DocDbGeneral] :'General'
}

export class DocDbState extends PackageState{

    childrenPanels$ = new BehaviorSubject([PanelId.DocDbGeneral, PanelId.DocDbExplorer])

    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.docdb)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: DocDbState){
        super( PanelId.DocDbGeneral, titles[PanelId.DocDbGeneral])
    }
    view() {
        return new HelmTabView(this.state, Backend.docdb)
    }
}

class ExplorerTabData extends Tabs.TabData{
    
    constructor(public readonly state: DocDbState){
        super(PanelId.DocDbExplorer, tabsDisplayInfo[PanelId.DocDbExplorer].title )
    }
    
    view() {
        return new ExplorerView(this.state)
    }
}




export class DocDbView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : DocDbState
    
    constructor(state:DocDbState){

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