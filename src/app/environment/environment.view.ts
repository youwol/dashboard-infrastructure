import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'

import { GeneralState, GeneralView } from './cluster.view'



let titles = {
    [PanelId.ConfigurationCluster] :'Cluster'
}
export class EnvironmentState {

    pack = undefined
    logMessages$ = new Subject<string>()

    generalState = new GeneralState()
    
    constructor(
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){

        Backend.environment.connectWs()
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.ConfigurationCluster, titles[PanelId.ConfigurationCluster])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}

export class EnvironmentView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : EnvironmentState
    
    constructor(state:EnvironmentState){

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