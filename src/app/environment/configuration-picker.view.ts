import { VirtualDOM } from "@youwol/flux-view"
import { popupFilesBrowserView } from "../views/files-browser.view"
import { GeneralState } from "./cluster.view"
import { Environment } from "./models"

export function configurationPickerView(environment: Environment){
    
    return {
        class: 'flex-grow-1  p-2',
        children: [
            {   class: 'd-flex align-items-center',
                children: [
                    {
                        style: { 'font-size': 'large' },
                        innerText: 'configuration:'
                    },
                    configurationPathView(environment),
                    {
                        class:'fv-pointer mx-3 fas fa-folder-open border rounded p-2 fv-hover-bg-background-alt',
                        onclick: () => popupFilesBrowserView({
                            fromPath: environment.configFilepath,
                            onSelected: (path) => {
                                GeneralState.switchConfiguration(path) 
                            } 
                        }) 
                    }
                ]
            }
        ]
    }
}


function configurationPathView(environment: Environment): VirtualDOM {
    
    return { 
        class: 'fv-text-focus fv-pointer', 
        innerText: environment.configFilepath, 
        style: { 'font-size': 'large' }
    }
}
