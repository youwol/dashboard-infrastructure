import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralState, GeneralView } from './general.view'
import { Status as DocDbStatus} from '../backend/docdb.router'


let titles = {
    [PanelId.DocDbGeneral] :'General'
}

export class DocDbState{

    status$ = new Subject<DocDbStatus>()

    generalState = new GeneralState()
    
    constructor(public readonly selectedPanel$: BehaviorSubject<PanelId>){
        Backend.docdb.connectWs()
        this.status$ = Backend.docdb.status$
        this.status$.subscribe( status => {
            console.log(status)
        })
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.DocDbGeneral, titles[PanelId.DocDbGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}


export class DocDbView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : DocDbState
    
    constructor(state:DocDbState){

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