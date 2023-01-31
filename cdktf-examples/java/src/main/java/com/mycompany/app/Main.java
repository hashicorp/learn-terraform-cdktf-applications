package com.mycompany.app;

import com.hashicorp.cdktf.App;
import com.mycompany.constructs.SimpleKubernetesWebAppConfig;

public class Main {
    public static void main(String[] args) {
        final App app = new App();
        new MyStack(app, "app", new MyStackConfig()
                .setBackend(new SimpleKubernetesWebAppConfig()
                        .setImage("localhost:5000/nocorp-backend:latest")
                        .setReplicas(1)
                        .setApp("myapp")
                        .setComponent("backend")
                        .setEnvironment("dev")
                        .setPort(30002))
                .setFrontend(new SimpleKubernetesWebAppConfig()
                        .setImage("localhost:5000/nocorp-frontend:latest")
                        .setReplicas(3)
                        .setApp("myapp")
                        .setComponent("frontend")
                        .setEnvironment("dev")
                        .setPort(30001)));
        app.synth();
    }
}