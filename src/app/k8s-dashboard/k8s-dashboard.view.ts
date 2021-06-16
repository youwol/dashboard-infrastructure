import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralState, GeneralView } from './general.view'
import { Status as K8sDashboardStatus} from '../backend/k8s-dashboard.router'


let titles = {
    [PanelId.K8sDashboardGeneral] :'General'
}

export class K8sDashboardState{

    status$ = new Subject<K8sDashboardStatus>()

    generalState = new GeneralState()
    
    constructor(public readonly selectedPanel$: BehaviorSubject<PanelId>){
        Backend.k8sDashboard.connectWs()
        this.status$ = Backend.k8sDashboard.status$
        this.status$.subscribe( status => {
            console.log(status)
        })
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.K8sDashboardGeneral, titles[PanelId.K8sDashboardGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}



export class K8sDashboardView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : K8sDashboardState
    
    constructor(state:K8sDashboardState){

        let tabsData = [
            new GeneralTabData(state.generalState)
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