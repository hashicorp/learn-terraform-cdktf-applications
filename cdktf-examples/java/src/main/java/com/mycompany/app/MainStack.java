package com.mycompany.app;

import software.constructs.Construct;

import java.util.List;
import java.util.Map;

import com.hashicorp.cdktf.TerraformStack;

import com.hashicorp.cdktf.providers.kubernetes.deployment.Deployment;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentMetadata;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpec;

public class MainStack extends TerraformStack {
    public MainStack(final Construct scope, final String id) {
        super(scope, id);

        Deployment.Builder.create(this, "myapp")
                .metadata((DeploymentMetadata) Map.of(
                        "labels", Map.of(
                                "app", "myapp",
                                "component", "frontend",
                                "environment", "dev"),
                        "name", "myapp-frontend-dev"))
                .spec((DeploymentSpec) Map.of(
                        "replicas", "1",
                        "selector", Map.of(
                                "matchLabels", Map.of(
                                        "app", "myapp",
                                        "component", "frontend",
                                        "environment", "dev")),
                        "template", Map.of(
                                "metadata", Map.of(
                                        "labels", Map.of(
                                                "app", "myapp",
                                                "component", "frontend",
                                                "environment", "dev")),
                                "spec", Map.of(
                                        "container", List.of(Map.of(
                                                "image", "nginx:latest",
                                                "name", "myapp-frontend-dev"))))))
                .build();
    }
}
