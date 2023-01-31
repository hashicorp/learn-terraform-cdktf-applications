package com.mycompany.constructs;

import java.util.Map;

public class SimpleKubernetesWebAppConfig {
    String image;
    Integer replicas;
    String app;
    String component;
    String environment;
    Map<String, String> env;
    Integer port;

    public SimpleKubernetesWebAppConfig setImage(String image) {
        this.image = image;
        return this;
    }

    public SimpleKubernetesWebAppConfig setReplicas(Integer replicas) {
        this.replicas = replicas;
        return this;
    }

    public SimpleKubernetesWebAppConfig setApp(String app) {
        this.app = app;
        return this;
    }

    public SimpleKubernetesWebAppConfig setComponent(String component) {
        this.component = component;
        return this;
    }

    public SimpleKubernetesWebAppConfig setEnvironment(String environment) {
        this.environment = environment;
        return this;
    }

    public SimpleKubernetesWebAppConfig setEnv(Map<String, String> env) {
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

    public Integer port() {
        return port;
    }

    public SimpleKubernetesWebAppConfig setPort(Integer port) {
        this.port = port;
        return this;
    }
}
