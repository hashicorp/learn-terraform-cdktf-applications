package com.mycompany.app;

import java.io.File;
import java.util.Map;

import com.hashicorp.cdktf.TerraformStack;
import com.hashicorp.cdktf.providers.kubernetes.provider.KubernetesProvider;
import com.hashicorp.cdktf.providers.kubernetes.provider.KubernetesProviderConfig;
import com.mycompany.constructs.SimpleKubernetesWebApp;
import com.mycompany.constructs.SimpleKubernetesWebAppConfig;

import software.constructs.Construct;

public class MyStack extends TerraformStack {
        public MyStack(final Construct scope, final String id, final MyStackConfig config) {
                super(scope, id);

                new KubernetesProvider(this, "provider", KubernetesProviderConfig.builder()
                                .configPath(new File("../../kubeconfig.yaml").getAbsolutePath())
                                .build());

                SimpleKubernetesWebApp app_backend = new SimpleKubernetesWebApp(this, "app_backend",
                                config.getBackend());

                new SimpleKubernetesWebApp(this, "app_frontend",
                                config.getFrontend()
                                                .setEnv(Map.of("BACKEND_APP_URL",
                                                                String.format("http://localhost:%d",
                                                                                app_backend.config.port()))));

        }
}
