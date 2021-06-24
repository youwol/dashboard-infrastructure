import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId, tabsDisplayInfo } from '../panels-info'
import { Status as MinioStatus} from './minio.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { ExplorerView } from './explorer.view'
import { HelmTabView } from '../helm/helm.view'


export class MinioState  implements PackageState {

    status$ : Observable<MinioStatus>

    childrenPanels$ = new BehaviorSubject([
        PanelId.MinioGeneral, 
        PanelId.MinioExplorer
    ])

    constructor(
        public readonly pack: Package, 
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){

        this.status$ = Backend.minio.watch(pack.namespace)
    }

    subscribe(): Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: MinioState){
        super( PanelId.MinioGeneral, tabsDisplayInfo[PanelId.MinioGeneral].title)
    }
    view() {
        return new HelmTabView(this.state, Backend.minio)
    }
}

class ExplorerTabData extends Tabs.TabData{
    
    constructor(public readonly state: MinioState){
        super( PanelId.MinioExplorer, tabsDisplayInfo[PanelId.MinioExplorer].title)
    }
    view() {
        return new ExplorerView(this.state)
    }
}

export class MinioView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : MinioState
    
    constructor(state:MinioState){

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