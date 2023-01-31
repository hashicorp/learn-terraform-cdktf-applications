package com.company.constructs;

import org.junit.jupiter.api.Test;

import com.hashicorp.cdktf.TerraformStack;
import com.hashicorp.cdktf.Testing;
import com.mycompany.constructs.KubernetesWebApp;
import com.mycompany.constructs.KubernetesWebAppDeploymentConfig;
import com.hashicorp.cdktf.providers.kubernetes.deployment.*;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class KubernetesWebAppTest {

    @Test
    void containsDeploymentResource() {
        TerraformStack stack = new TerraformStack(Testing.app(), "stack");

        new KubernetesWebApp(stack, "myapp-test",
                new KubernetesWebAppDeploymentConfig()
                        .setImage("nginx:latest")
                        .setReplicas(4)
                        .setApp("myapp")
                        .setComponent("frontend")
                        .setEnvironment("dev"));
        String synthesized = Testing.synth(stack);

        assertTrue(Testing.toHaveResource(synthesized, Deployment.TF_RESOURCE_TYPE));
    }
}
