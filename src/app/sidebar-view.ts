import { VirtualDOM, child$, attr$, children$ } from '@youwol/flux-view'
import { combineLatest, Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { AppState } from './app-state'
import { DeploymentStatus, PackageState, SanityEnum } from './models'
import { PanelId, tabsDisplayInfo } from './panels-info'
import { ExpandableGroup } from '@youwol/fv-group'


export class SideBarView implements VirtualDOM{

    public readonly tag = 'div'
    public readonly class = "d-flex flex-column p-2 border h-100 overflow-auto"
    public readonly style = {'min-width': '25%'}

    public readonly children

    constructor( public readonly state: AppState ){

        this.children = [
            child$(
                state.packagesState$,
                (packages: Array<PackageState>) => this.namespacesView(packages) 
            )
        ]
    }

    namespacesView(packagesState :  Array<PackageState>) {

        let namespaces = Array.from(new Set(packagesState.map( p => p.pack.namespace )))

        let views = namespaces.map( namespace => {
            let state = new ExpandableGroup.State(namespace, false)
            return new ExpandableGroup.View({
                state,
                class:'my-3',
                headerView: (state) => ExpandableGroup.defaultHeaderView(state),
                contentView: (state) => {
                    return {
                        class: 'p-3',
                        children: packagesState
                        .filter( p => p.pack.namespace == state.name )
                        .map(
                            (packState:PackageState) => {
                                return sectionGeneric(
                                    packState,
                                    this.state
                                )
                            }
                        )
                        }
                }
            } as any )
        })
        
        return {
            children: views
        }
    }
}



function sectionTitle( 
    name: string,
    url: string,
    sectionSelected$:Observable<boolean>,
    status$?: Observable<DeploymentStatus> 
    ) : VirtualDOM {


    let statusClass = status$ 
        ? attr$( 
            status$,
            (status:DeploymentStatus) => {
                let classesDict = {
                    [SanityEnum.SANE] : "fv-text-success fas fa-check",
                    [SanityEnum.WARNINGS] : "fv-text-focus fas fa-exclamation",
                    [SanityEnum.BROKEN] : "fv-text-error fas fa-times",
                }
                if(status.pending){
                    return 'fv-text-primary fas fa-cog fa-spin'
                }
                if(!status.installed){
                    return 'fv-text-disabled fas fa-times'
                }
                return classesDict[status.sanity]
            },
            {wrapper: (d) => d+ "  px-2" }
        )
        : ""
    let baseClasses = "d-flex align-items-center fa-2x"
    return {   
        class: attr$( 
            sectionSelected$,
            (selected) => selected ? 'fv-text-focus ' : '',
            {   wrapper: (d) => d + baseClasses,
                untilFirst: baseClasses
            }   
        ),
        children:[
            {
                tag:'img',
                src: url,
                style:{width:"50px"},
                class: " pr-3"
            },
            {
                innerText:name, style:{'user-select': 'none', 'font-size':'x-large'}
            },
            {
                class: statusClass
            }
        ]
    }
 }

 function subSectionsList( 
    packState: PackageState,
    state: AppState
    )  {

     return {
        tag: 'ul',
        children: children$(
            packState.childrenPanels$,
            (targets) => {
                return targets.map( panelId =>  tabSubSection(packState, panelId, state) ) 
            }
        )
    }
 }
 
function tabSubSection( 
    packState: PackageState, 
    target: PanelId, 
    state: AppState
    ) : VirtualDOM {

    let enabled = tabsDisplayInfo[target].enabled
    let selected$ = combineLatest([
        state.selectedPackage$,
        state.selectedPanel$
    ]).pipe(
        map( ([pack, panelId]) =>  panelId == target && pack == packState.pack)
    )
    return {
        tag:'li',
            innerText: tabsDisplayInfo[target].title,
            class: attr$( 
                selected$,
                (selected) => selected ? 'fv-text-focus' : (enabled ? 'fv-pointer' : 'fv-text-background-alt')
            ),
            style:{'user-select': 'none'},
            onclick: (ev) => {
                state.select(packState.pack.name, packState.pack.namespace, target)
               
                ev.stopPropagation() 
            }
        }
}

function sectionGeneric(
    packState: PackageState, 
    state: AppState
    ){

    let sectionSelected$ = state.selectedPackage$.pipe(
        map( selected => {
            return selected == packState.pack 
        })
    )
    return {
        class: 'my-2 ',
        children:[
            sectionTitle(packState.pack.name, packState.pack.icon, sectionSelected$, packState.status$ ),
            subSectionsList(packState, state)
        ],
        //onclick:()=> selected$.next(targets[0])
    }
}
