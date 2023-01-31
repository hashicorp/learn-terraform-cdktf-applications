package com.mycompany.app;

import java.io.File;
import com.mycompany.constructs.*;
import software.constructs.Construct;
import com.hashicorp.cdktf.TerraformStack;
import com.hashicorp.cdktf.providers.kubernetes.provider.*;

public class MainStack extends TerraformStack {
    public MainStack(final Construct scope, final String id) {
        super(scope, id);

        new KubernetesProvider(this, "provider", KubernetesProviderConfig.builder()
                .configPath(new File("../../kubeconfig.yaml").getAbsolutePath())
                .build());

        new KubernetesWebApp(this, "deployment", new KubernetesWebAppDeploymentConfig()
                .setImage("nginx:latest")
                .setReplicas(2)
                .setApp("myapp")
                .setComponent("frontend")
                .setEnvironment("dev"));

        new KubernetesNodePortService(this, "service", new KubernetesNodePortServiceConfig()
                .setPort(30001)
                .setApp("myapp")
                .setComponent("frontend")
                .setEnvironment("dev"));
    }
}
