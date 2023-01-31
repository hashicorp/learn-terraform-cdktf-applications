package com.mycompany.constructs;

public class SimpleKubernetesWebAppConfig {
    private KubernetesWebAppDeploymentConfig deployment;
    private KubernetesNodePortServiceConfig service;

    public KubernetesWebAppDeploymentConfig deployment() {
        return deployment;
    }

    public SimpleKubernetesWebAppConfig setDeployment(KubernetesWebAppDeploymentConfig deployment) {
        this.deployment = deployment;
        return this;
    }

    public KubernetesNodePortServiceConfig service() {
        return service;
    }

    public SimpleKubernetesWebAppConfig setService(KubernetesNodePortServiceConfig service) {
        this.service = service;
        return this;
    }

}
