



export enum PanelId {
    None = "none",
    ConfigurationCluster = "conf.cluster",
    K8sDashboardGeneral = "k8sDashboard.general",
    PostgreSqlGeneral = "postgreSql.general",
    KongGeneral = "kong.general",
    KongAdmin = "kong.admin",
    KongAcme = "kong.acme",
    MinioGeneral = "minio.general",
    MinioExplorer = "minio.explorer",
    ScyllaGeneral = "scylla.general",
    ScyllaExplorer = "scylla.explorer",
    DocDbGeneral = "docdb.general",
    DocDbExplorer = "docdb.explorer",
    DocDbInitialization = "docdb.initialization",
    StorageGeneral = "storage.general",
    RedisGeneral = "redis.general",
    CDNGeneral = "cdn.general",
    CdnAppsServerGeneral = "cdn-apps-server.general",
    KeycloakGeneral = "keycloak.general",
    TreeDbBackendGeneral = "treedb.general",
    AssetsBackendGeneral = "assets-backend.general",
    AssetsGatewayGeneral = "assets-gateway.general",
    FluxBackendGeneral = "flux-backend.general",
    FrontApiGeneral = "front-api.general",
    WorkspaceExplorerGeneral = "workspace-explorer.general",
    FluxBuilderGeneral = "flux-builder.general",
    FluxRunnerGeneral = "flux-runner.general",
    NetworkGeneral = "network.general",
    NetworkBackendGeneral = "network-backend.general",
    StoriesGeneral = "stories.general",
    StoriesBackendGeneral = "stories-backend.general",
    ExhibitionHallsGeneral = "exhibition-halls.general"
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true },
    [PanelId.K8sDashboardGeneral]: { title: "General", enabled: true },
    [PanelId.PostgreSqlGeneral]: { title: "General", enabled: true },
    [PanelId.KongGeneral]: { title: "General", enabled: true },
    [PanelId.KongAdmin]: { title: "Admin", enabled: true },
    [PanelId.KongAcme]: { title: "ACME plugin", enabled: true },
    [PanelId.MinioGeneral]: { title: "General", enabled: true },
    [PanelId.MinioExplorer]: { title: "Explorer", enabled: true },
    [PanelId.ScyllaGeneral]: { title: "General", enabled: true },
    [PanelId.ScyllaExplorer]: { title: "Explorer", enabled: true },
    [PanelId.DocDbGeneral]: { title: "General", enabled: true },
    [PanelId.DocDbExplorer]: { title: "Explorer", enabled: true },
    [PanelId.DocDbInitialization]: { title: "Data initialization", enabled: true },
    [PanelId.StorageGeneral]: { title: "General", enabled: true },
    [PanelId.RedisGeneral]: { title: "General", enabled: true },
    [PanelId.CDNGeneral]: { title: "General", enabled: true },
    [PanelId.CdnAppsServerGeneral]: { title: "General", enabled: true },
    [PanelId.KeycloakGeneral]: { title: "General", enabled: true },
    [PanelId.TreeDbBackendGeneral]: { title: "General", enabled: true },
    [PanelId.AssetsBackendGeneral]: { title: "General", enabled: true },
    [PanelId.AssetsGatewayGeneral]: { title: "General", enabled: true },
    [PanelId.FluxBackendGeneral]: { title: "General", enabled: true },
    [PanelId.FrontApiGeneral]: { title: "General", enabled: true },
    [PanelId.WorkspaceExplorerGeneral]: { title: "General", enabled: true },
    [PanelId.FluxBuilderGeneral]: { title: "General", enabled: true },
    [PanelId.FluxRunnerGeneral]: { title: "General", enabled: true },
    [PanelId.NetworkGeneral]: { title: "General", enabled: true },
    [PanelId.NetworkBackendGeneral]: { title: "General", enabled: true },
    [PanelId.StoriesGeneral]: { title: "General", enabled: true },
    [PanelId.StoriesBackendGeneral]: { title: "General", enabled: true },
    [PanelId.ExhibitionHallsGeneral]: { title: "General", enabled: true }
}

