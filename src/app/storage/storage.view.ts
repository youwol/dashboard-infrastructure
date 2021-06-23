import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Subject } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralState, GeneralView } from './general.view'
import { Status as StorageStatus} from '../backend/storage.router'


let titles = {
    [PanelId.StorageGeneral] :'General'
}

export class StorageState{

    status$ = new Subject<StorageStatus>()

    generalState = new GeneralState()
    
    constructor(public readonly selectedPanel$: BehaviorSubject<PanelId>){
        Backend.storage.connectWs()
        this.status$ = Backend.storage.status$
        this.status$.subscribe( status => {
            console.log(status)
        })
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.StorageGeneral, titles[PanelId.StorageGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}


export class StorageView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : StorageState
    
    constructor(state:StorageState){

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