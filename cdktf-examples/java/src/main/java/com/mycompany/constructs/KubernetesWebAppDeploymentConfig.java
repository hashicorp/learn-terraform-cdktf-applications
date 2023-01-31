package com.mycompany.constructs;

import java.util.Map;

public class KubernetesWebAppDeploymentConfig {
    String image;
    Integer replicas;
    String app;
    String component;
    String environment;
    Map<String, String> env;

    public KubernetesWebAppDeploymentConfig() {
        this.image = null;
        this.replicas = null;
        this.app = null;
        this.component = null;
        this.environment = null;
        this.env = null;
    }

    public KubernetesWebAppDeploymentConfig setImage(String image) {
        this.image = image;
        return this;
    }

    public KubernetesWebAppDeploymentConfig setReplicas(Integer replicas) {
        this.replicas = replicas;
        return this;
    }

    public KubernetesWebAppDeploymentConfig setApp(String app) {
        this.app = app;
        return this;
    }

    public KubernetesWebAppDeploymentConfig setComponent(String component) {
        this.component = component;
        return this;
    }

    public KubernetesWebAppDeploymentConfig setEnvironment(String environment) {
        this.environment = environment;
        return this;
    }

    public KubernetesWebAppDeploymentConfig setEnv(Map<String, String> env) {
        this.env = env;
        return this;
    }

    public String image() {
        return this.image;
    }

    public Integer replicas() {
        return this.replicas;
    }

    public String app() {
        return this.app;
    }

    public String component() {
        return this.component;
    }

    public String environment() {
        return this.environment;
    }

    public Map<String, String> env() {
        return this.env;
    }
}
