import { VirtualDOM, child$, attr$, children$ } from '@youwol/flux-view'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { AppState } from './app-state'
import { Backend } from './backend/router'
import { GeneralState } from './environment/cluster.view'
import { Environment } from './environment/models'
import { PanelId, tabsDisplayInfo } from './panels-info'


export class SideBarView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly class = "d-flex justify-content-center py-5 px-2 border h-100 "
    public readonly style = { 'min-width':'300px'}

    public readonly children

    constructor( public readonly state: AppState ){

        this.children = [
            {
                class:"h-100 mx-auto d-flex flex-column pl-3",
                children:[ 
                    {
                        tag:'a',
                        href:'/ui/workspace-explorer',
                        class:'w-100 mb-2 d-flex justify-content-center',
                        children:[
                            {
                                tag: 'img',
                                class:'mx-auto text-center fv-pointer',
                                style:{width:"75%"},
                                href:'/ui/workspace-explorer',
                                src:'/api/assets-gateway/raw/package/QHlvdXdvbC9mbHV4LXlvdXdvbC1lc3NlbnRpYWxz/latest/assets/images/logo_YouWol_Platform_white.png'
                            },
                        ]
                    },
                    sectionGeneric(
                        'Environment',
                        'fas fa-users-cog my-2',
                        this.state.environmentChildren$,
                        this.state.selected$
                    )
                ]
            }
           
        ]
    }
}


function sectionTitle( 
    name: string,
    classes: string,
    sectionSelected$:Observable<boolean>,
    enabled: boolean = true
    ) : VirtualDOM {

    return {   
        class: attr$( 
            sectionSelected$,
            (selected) => selected ? 'fv-text-focus' : '',
            {wrapper: (d) => d+ "  d-flex align-items-center fa-2x "+ (enabled? 'fv-pointer': '')}
        ),
        children:[
            {
                tag:'i',
                class: classes+" pr-3"
            },
            {
                tag:'h4', innerText:name, style:{'user-select': 'none'}
            }
        ]
    }
 }

 function subSectionsList( 
     targets$: Observable<Array<PanelId>>, 
     selected$:Subject<PanelId>)  {

     return {
        tag: 'ul',
        children: children$(
            targets$,
            (targets) => {
                return targets.map( panelId =>  tabSubSection(panelId, selected$) ) 
            }
        )
    }
 }
 
function tabSubSection( target: PanelId, selected$:Subject<PanelId>) : VirtualDOM {

    let enabled = tabsDisplayInfo[target].enabled
   return {
       tag:'li',
        innerText: tabsDisplayInfo[target].title,
        class: attr$( 
            selected$,
            (panelId) => panelId == target ? 'fv-text-focus' : (enabled ? 'fv-pointer' : 'fv-text-background-alt')
        ),
        style:{'user-select': 'none'},
        onclick: (ev) => {
            enabled && selected$.next(target)
            ev.stopPropagation() 
        }
    }
}

function sectionGeneric(
    name: string, 
    classes: string, 
    targets$: Observable<Array<PanelId>>, 
    selected$:Subject<PanelId>, 
    enabled: boolean =true){

    let sectionSelected$ = selected$.pipe(
        mergeMap( selected => targets$.pipe( map( (targets) => targets.includes(selected)) ) )
    )

    return {
        class: 'my-2 '+(enabled ? '' : 'fv-text-disabled'),
        children:[
            sectionTitle(name, classes, sectionSelected$, enabled),
            subSectionsList(targets$, selected$)
        ],
        //onclick:()=> selected$.next(targets[0])
    }
}

function sectionResources(){

    return {
        class: 'my-2 ',
        children:[
            sectionTitle('Resources', 'fas fa-book', new BehaviorSubject(false)),
            child$(
                GeneralState.environment$,
                (environment:Environment) => {
                    return {
                        tag:'ul',
                        class:'d-flex flex-column',
                        children: Object.entries({}
                            /*environment.configuration.general.resources*/).map( ([name,url]) => {
                            return {
                                tag:'li',
                                children:[{
                                    tag:'a',
                                    href:url,
                                    innerText:name
                                }]
                            }
                        })
                    }
                }
            )
        ],
    }
}
