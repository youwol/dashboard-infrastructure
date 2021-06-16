



export enum PanelId{
    ConfigurationCluster = "conf.cluster",
    K8sDashboardGeneral = "k8sDashboard.general"
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true},
    [PanelId.K8sDashboardGeneral]: { title: "General", enabled: true}
}

