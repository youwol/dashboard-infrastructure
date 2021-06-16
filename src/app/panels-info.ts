



export enum PanelId{
    ConfigurationCluster = "conf.cluster",
    ApiGatewayKong = "apiGateway.kong",
    InfraSQL = "infra.sql"
}

export let tabsDisplayInfo = {
    [PanelId.ConfigurationCluster]: { title: "Cluster", enabled: true},
    [PanelId.InfraSQL]: { title: "postgreSQL", enabled: true},
    [PanelId.ApiGatewayKong]: { title: "Kong API Gateway", enabled: true}
}

