import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { GeneralView } from './general.view'
import { Status as RedisStatus} from './redis.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'


let titles = {
    [PanelId.RedisGeneral] :'General'
}

export class RedisState implements PackageState {

    status$ : Observable<RedisStatus>
    childrenPanels$ = new BehaviorSubject([PanelId.RedisGeneral])

    constructor(
        public readonly pack: Package, 
        public readonly selectedPanel$: BehaviorSubject<PanelId>
        ){
        this.status$ = Backend.redis.watch(pack.namespace)
    }

    subscribe() : Array<Subscription> {
        return []
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly generalState){
        super( PanelId.RedisGeneral, titles[PanelId.RedisGeneral])
    }
    view() {
        return new GeneralView(this.generalState)
    }
}


export class RedisView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : RedisState
    
    constructor(state:RedisState){

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