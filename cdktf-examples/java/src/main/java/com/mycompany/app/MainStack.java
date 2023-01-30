package com.mycompany.app;

import software.constructs.Construct;

import java.util.List;
import java.util.Map;

import com.hashicorp.cdktf.TerraformStack;

import com.hashicorp.cdktf.providers.kubernetes.deployment.*;
import com.hashicorp.cdktf.providers.kubernetes.provider.*;

public class MainStack extends TerraformStack {
    public MainStack(final Construct scope, final String id) {
        super(scope, id);

        new KubernetesProvider(this, "provider", KubernetesProviderConfig.builder()
                .configPath("../../kubeconfig.yaml")
                .build());

        new Deployment(this, "deployment", DeploymentConfig.builder()
                .metadata(DeploymentMetadata.builder()
                        .labels(Map.of("app", "myapp", "component", "frontend", "environment", "dev"))
                        .name("myapp")
                        .build())
                .spec(DeploymentSpec.builder()
                        .replicas("1")
                        .selector(DeploymentSpecSelector.builder()
                                .matchLabels(Map.of("app", "myapp", "component", "frontend", "environment", "dev"))
                                .build())
                        .template(DeploymentSpecTemplate.builder()
                                .metadata(DeploymentSpecTemplateMetadata.builder()
                                        .labels(Map.of("app", "myapp", "component", "frontend", "environment", "dev"))
                                        .build())
                                .spec(DeploymentSpecTemplateSpec.builder()
                                        .container(List.of(DeploymentSpecTemplateSpecContainer.builder()
                                                .image("nginx:latest")
                                                .name("frontend")
                                                .build()))
                                        .build())
                                .build())
                        .build())
                .build());

    }
}
