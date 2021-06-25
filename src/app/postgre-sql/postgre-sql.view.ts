import { VirtualDOM } from '@youwol/flux-view'
import { Tabs } from '@youwol/fv-tabs'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { Backend } from '../backend/router'
import { PanelId } from '../panels-info'
import { Status as PostgreSqlStatus} from './postgre-sql.router'
import { PackageState } from '../models'
import { Package } from '../environment/models'
import { HelmTabView } from '../helm/helm.view'


let titles = {
    [PanelId.PostgreSqlGeneral] :'General'
}

export class PostgreSqlState extends PackageState{

    childrenPanels$ = new BehaviorSubject([PanelId.PostgreSqlGeneral])
        
    constructor(
        pack: Package,
        selectedPanel$: BehaviorSubject<PanelId>
        ){
            super(pack, selectedPanel$, Backend.postgreSql)
    }
}

class GeneralTabData extends Tabs.TabData{
    
    constructor(public readonly state: PostgreSqlState){
        super( PanelId.PostgreSqlGeneral, titles[PanelId.PostgreSqlGeneral])
    }
    view() {
        return new HelmTabView(this.state, Backend.postgreSql)
    }
}



export class PostgreSqlView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly children : Array<VirtualDOM> 
    public readonly class = 'p-2 h-100 flex-grow-1'
    public readonly state : PostgreSqlState
    
    constructor(state:PostgreSqlState){

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