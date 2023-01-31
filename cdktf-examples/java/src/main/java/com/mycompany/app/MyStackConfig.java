package com.mycompany.app;

import com.mycompany.constructs.SimpleKubernetesWebAppConfig;

public class MyStackConfig {
    private SimpleKubernetesWebAppConfig frontend;
    private SimpleKubernetesWebAppConfig backend;

    public SimpleKubernetesWebAppConfig getFrontend() {
        return frontend;
    }

    public MyStackConfig setFrontend(SimpleKubernetesWebAppConfig frontend) {
        this.frontend = frontend;
        return this;
    }

    public SimpleKubernetesWebAppConfig getBackend() {
        return backend;
    }

    public MyStackConfig setBackend(SimpleKubernetesWebAppConfig backend) {
        this.backend = backend;
        return this;
    }
}
