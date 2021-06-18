



export enum PanelId{
    ConfigurationCluster = "conf.cluster",
    K8sDashboardGeneral = "k8sDashboard.general",
    PostgreSqlGeneral = "postgreSql.general",
    KongGeneral = "kong.general",
    KongAdmin = "kong.admin",
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true},
    [PanelId.K8sDashboardGeneral]: { title: "General", enabled: true},
    [PanelId.PostgreSqlGeneral]: { title: "General", enabled: true},
    [PanelId.KongGeneral]: { title: "General", enabled: true},
    [PanelId.KongAdmin]: { title: "Admin", enabled: true},
}

