package com.company.constructs;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.hashicorp.cdktf.TerraformStack;
import com.hashicorp.cdktf.Testing;
import com.hashicorp.cdktf.providers.kubernetes.service.Service;
import com.mycompany.constructs.KubernetesNodePortService;
import com.mycompany.constructs.KubernetesNodePortServiceConfig;

public class KubernetesNodePortServiceTest {

    @Test
    void containsServiceResource() {
        TerraformStack stack = new TerraformStack(Testing.app(), "stack");

        new KubernetesNodePortService(stack, "myapp-test",
                new KubernetesNodePortServiceConfig()
                        .setPort(30001)
                        .setApp("myapp")
                        .setComponent("frontend")
                        .setEnvironment("dev"));

        String synthesized = Testing.synth(stack);

        assertTrue(Testing.toHaveResource(synthesized, Service.TF_RESOURCE_TYPE));
    }
}
