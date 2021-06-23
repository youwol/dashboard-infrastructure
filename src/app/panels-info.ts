



export enum PanelId{
    ConfigurationCluster = "conf.cluster",
    K8sDashboardGeneral = "k8sDashboard.general",
    PostgreSqlGeneral = "postgreSql.general",
    KongGeneral = "kong.general",
    KongAdmin = "kong.admin",
    MinioGeneral = "minio.general"
    ScyllaGeneral = "scylla.general",
    RedisGeneral = "redis.general"
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true},
    [PanelId.K8sDashboardGeneral]: { title: "General", enabled: true},
    [PanelId.PostgreSqlGeneral]: { title: "General", enabled: true},
    [PanelId.KongGeneral]: { title: "General", enabled: true},
    [PanelId.KongAdmin]: { title: "Admin", enabled: true},
    [PanelId.MinioGeneral]: { title: "General", enabled: true},
    [PanelId.ScyllaGeneral]: { title: "General", enabled: true},
    [PanelId.RedisGeneral]: { title: "General", enabled: true},
}

