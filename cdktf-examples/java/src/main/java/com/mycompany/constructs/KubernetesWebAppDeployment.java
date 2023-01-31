package com.mycompany.constructs;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.hashicorp.cdktf.providers.kubernetes.deployment.Deployment;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentConfig;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentMetadata;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpec;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecSelector;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecTemplate;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecTemplateMetadata;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecTemplateSpec;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecTemplateSpecContainer;
import com.hashicorp.cdktf.providers.kubernetes.deployment.DeploymentSpecTemplateSpecContainerEnv;

import software.constructs.Construct;

public class KubernetesWebAppDeployment extends Construct {
        public Deployment resource;

        public KubernetesWebAppDeployment(Construct scope, String name, KubernetesWebAppDeploymentConfig config) {
                super(scope, name);

                String deploymentName = String.format("%s-%s-%s", config.app(), config.component(),
                                config.environment());

                List<DeploymentSpecTemplateSpecContainerEnv> env;
                if (config.env() != null) {
                        Set<Entry<String, String>> entries = config.env().entrySet();
                        env = new java.util.ArrayList<>(entries.size());

                        for (Entry<String, String> entry : entries) {
                                env.add(DeploymentSpecTemplateSpecContainerEnv.builder()
                                                .name(entry.getKey())
                                                .value(entry.getValue())
                                                .build());
                        }
                } else {
                        env = new java.util.ArrayList<DeploymentSpecTemplateSpecContainerEnv>(0);
                }

                this.resource = new Deployment(this, name, DeploymentConfig.builder()
                                .metadata(DeploymentMetadata.builder()
                                                .labels(Map.of(
                                                                "app", config.app(),
                                                                "component", config.component(),
                                                                "environment", config.environment()))
                                                .name(deploymentName)
                                                .build())
                                .spec(DeploymentSpec.builder()
                                                .replicas(config.replicas().toString())
                                                .selector(DeploymentSpecSelector.builder()
                                                                .matchLabels(Map.of(
                                                                                "app", config.app(),
                                                                                "component", config.component(),
                                                                                "environment", config.environment()))
                                                                .build())
                                                .template(DeploymentSpecTemplate.builder()
                                                                .metadata(DeploymentSpecTemplateMetadata.builder()
                                                                                .labels(Map.of(
                                                                                                "app", config.app(),
                                                                                                "component",
                                                                                                config.component(),
                                                                                                "environment",
                                                                                                config.environment()))
                                                                                .build())
                                                                .spec(DeploymentSpecTemplateSpec.builder()
                                                                                .container(List.of(
                                                                                                DeploymentSpecTemplateSpecContainer
                                                                                                                .builder()
                                                                                                                .image(config.image())
                                                                                                                .name(deploymentName)
                                                                                                                .env(env)
                                                                                                                .build()))
                                                                                .build())
                                                                .build())
                                                .build())
                                .build());
        }
}
