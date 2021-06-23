import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralState, GeneralView } from './general.view'
import { Status as ScyllaStatus} from '../backend/scylla.router'


let titles = {
    [PanelId.ScyllaGeneral] :'General'
}

export class ScyllaState{

    status$ = new Subject<ScyllaStatus>()

    generalState = new GeneralState()
    
    constructor(public readonly selectedPanel$: BehaviorSubject<PanelId>){
        Backend.scylla.connectWs()
        this.status$ = Backend.scylla.status$
        this.status$.subscribe( status => {
            console.log(status)
        })
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.ScyllaGeneral, titles[PanelId.ScyllaGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}


export class ScyllaView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : ScyllaState
    
    constructor(state:ScyllaState){

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