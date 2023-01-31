package com.mycompany.constructs;

import org.jetbrains.annotations.NotNull;

import com.hashicorp.cdktf.TerraformOutput;
import com.hashicorp.cdktf.TerraformOutputConfig;

import software.constructs.Construct;

public class SimpleKubernetesWebApp extends Construct {
    public final KubernetesWebAppDeployment deployment;
    public final KubernetesNodePortService service;
    public final SimpleKubernetesWebAppConfig config;

    public SimpleKubernetesWebApp(@NotNull Construct scope, @NotNull String id,
            @NotNull SimpleKubernetesWebAppConfig config) {
        super(scope, id);

        this.config = config;

        this.deployment = new KubernetesWebAppDeployment(this, "deployment", new KubernetesWebAppDeploymentConfig()
                .setImage(config.image())
                .setReplicas(config.replicas())
                .setApp(config.app())
                .setComponent(config.component())
                .setEnvironment(config.environment())
                .setEnv(config.env()));

        this.service = new KubernetesNodePortService(this, "service", new KubernetesNodePortServiceConfig()
                .setApp(config.app())
                .setComponent(config.component())
                .setEnvironment(config.environment())
                .setPort(config.port()));

        new TerraformOutput(this, "url", TerraformOutputConfig.builder()
                .value(String.format("http://localhost:%s", config.port())).build());
    }

}
