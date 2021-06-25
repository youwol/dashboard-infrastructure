



export enum PanelId{
    None = "none",
    ConfigurationCluster = "conf.cluster",
    K8sDashboardGeneral = "k8sDashboard.general",
    PostgreSqlGeneral = "postgreSql.general",
    KongGeneral = "kong.general",
    KongAdmin = "kong.admin",
    MinioGeneral = "minio.general",
    MinioExplorer = "minio.explorer",
    ScyllaGeneral = "scylla.general",
    ScyllaExplorer = "scylla.explorer",
    DocDbGeneral = "docdb.general",
    StorageGeneral = "storage.general",
    RedisGeneral = "redis.general",
    CDNGeneral = "cdn.general",
    KeycloakGeneral = "keycloak.general"
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true},
    [PanelId.K8sDashboardGeneral]: { title: "General", enabled: true},
    [PanelId.PostgreSqlGeneral]: { title: "General", enabled: true},
    [PanelId.KongGeneral]: { title: "General", enabled: true},
    [PanelId.KongAdmin]: { title: "Admin", enabled: true},
    [PanelId.MinioGeneral]: { title: "General", enabled: true},
    [PanelId.MinioExplorer]: { title: "Explorer", enabled: true},
    [PanelId.ScyllaGeneral]: { title: "General", enabled: true},
    [PanelId.ScyllaExplorer]: { title: "Explorer", enabled: true},
    [PanelId.DocDbGeneral]: { title: "General", enabled: true},
    [PanelId.StorageGeneral]: { title: "General", enabled: true},
    [PanelId.RedisGeneral]: { title: "General", enabled: true},
    [PanelId.CDNGeneral]: { title: "General", enabled: true},
    [PanelId.KeycloakGeneral]: { title: "General", enabled: true},
}

