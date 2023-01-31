package com.mycompany.constructs;

public class KubernetesNodePortServiceConfig {
    Integer port;
    String app;

    String component;
    String environment;

    public Integer port() {
        return port;
    }

    public KubernetesNodePortServiceConfig setPort(Integer port) {
        this.port = port;
        return this;
    }

    public String app() {
        return app;
    }

    public KubernetesNodePortServiceConfig setApp(String app) {
        this.app = app;
        return this;
    }

    public String component() {
        return component;
    }

    public KubernetesNodePortServiceConfig setComponent(String component) {
        this.component = component;
        return this;
    }

    public String environment() {
        return environment;
    }

    public KubernetesNodePortServiceConfig setEnvironment(String environment) {
        this.environment = environment;
        return this;
    }
}
