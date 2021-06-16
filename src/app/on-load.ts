import { child$, render } from '@youwol/flux-view'
import { SideBarView } from "./sidebar-view";
import { filter, take } from 'rxjs/operators';
import { Backend } from './backend/router';
import { plugSystemErrors } from './system-errors.view';
import { AppState } from './app-state';
import { LogsState, LogsView } from './logs-view';

require('./style.css');


let appState = new AppState()

let sideBar = new SideBarView(appState)



let vDOM = {
    class: 'd-flex fv-text-primary h-100 w-100',
    children: [
        sideBar,
        {
            class: 'd-flex flex-column w-100',
            children:[
                child$( 
                    appState.panelViewFactory$,
                    (selected) => selected
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

