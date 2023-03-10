package com.company.constructs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.hashicorp.cdktf.TerraformStack;
import com.hashicorp.cdktf.Testing;
import com.hashicorp.cdktf.providers.kubernetes.deployment.Deployment;
import com.hashicorp.cdktf.providers.kubernetes.service.Service;
import com.mycompany.constructs.SimpleKubernetesWebApp;
import com.mycompany.constructs.SimpleKubernetesWebAppConfig;

public class SimpleKubernetesWebAppTest {
        @Test
        void containsServiceResource() {
                TerraformStack stack = new TerraformStack(Testing.app(), "stack");

                new SimpleKubernetesWebApp(stack, "myapp-test",
                                new SimpleKubernetesWebAppConfig()
                                                .setReplicas(4)
                                                .setPort(30001)
                                                .setApp("myapp")
                                                .setComponent("frontend")
                                                .setEnvironment("dev")
                                                .setImage("nginx:latest"));

                String synthesized = Testing.synth(stack);

                assertTrue(Testing.toHaveResource(synthesized, Service.TF_RESOURCE_TYPE));

        }

        @Test
        void containsDeploymentResource() {
                TerraformStack stack = new TerraformStack(Testing.app(), "stack");

                new SimpleKubernetesWebApp(stack, "myapp-test",
                                new SimpleKubernetesWebAppConfig()
                                                .setReplicas(4)
                                                .setPort(30001)
                                                .setApp("myapp")
                                                .setComponent("frontend")
                                                .setEnvironment("dev")
                                                .setImage("nginx:latest")

                );

                String synthesized = Testing.synth(stack);

                assertTrue(Testing.toHaveResource(synthesized, Deployment.TF_RESOURCE_TYPE));
        }
}
