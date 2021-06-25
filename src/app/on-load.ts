import { child$, render } from '@youwol/flux-view'
import { SideBarView } from "./sidebar-view";
import { filter, take } from 'rxjs/operators';
import { Backend } from './backend/router';
import { plugSystemErrors } from './system-errors.view';
import { AppState } from './app-state';
import { LogsState, LogsView } from './logs-view';
import { GeneralState, GeneralView } from './environment/cluster.view';

require('./style.css');

await Backend.connectWs()

let appState = new AppState()

let sideBar = new SideBarView(appState)

let clusterState = new GeneralState()
let clusterView = new GeneralView(clusterState)


let vDOM = {
    class: 'd-flex fv-text-primary h-100 w-100',
    children: [
        sideBar,
        {
            class: 'd-flex flex-column w-100',
            children:[
                clusterView,
                child$( 
                    appState.panelViewFactory$,
                    (selected) => selected,
                    {untilFirst: { class:'flex-grow-1'}}
                ),
                new LogsView()
            ]
        }
    ]
}
document.body.appendChild(render(vDOM))

/*
let adminWS = Backend.system.connectWs()

let systemErrors$ = adminWS.pipe(
    filter(message => message.type=="SystemError")
)

plugSystemErrors( systemErrors$ )

adminWS.pipe(take(1)).subscribe( message => {
    document.body.appendChild(render(vDOM))
})*/

