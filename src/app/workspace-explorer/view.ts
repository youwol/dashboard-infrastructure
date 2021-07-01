import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as WorkspaceExplorerStatus} from './router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


export class WorkspaceExplorerState extends PackageState{

    childrenPanels$ = new BehaviorSubject([PanelId.WorkspaceExplorerGeneral])

    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.workspaceExplorer)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: WorkspaceExplorerState){
        super( PanelId.WorkspaceExplorerGeneral, tabsDisplayInfo[PanelId.WorkspaceExplorerGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.workspaceExplorer)
    }
}


export class WorkspaceExplorerView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : WorkspaceExplorerState
    
    constructor(state:WorkspaceExplorerState){

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