package com.mycompany.constructs;

import java.util.List;
import java.util.Map;

import org.jetbrains.annotations.NotNull;

import com.hashicorp.cdktf.providers.kubernetes.service.Service;
import com.hashicorp.cdktf.providers.kubernetes.service.ServiceConfig;
import com.hashicorp.cdktf.providers.kubernetes.service.ServiceMetadata;
import com.hashicorp.cdktf.providers.kubernetes.service.ServiceSpec;
import com.hashicorp.cdktf.providers.kubernetes.service.ServiceSpecPort;

import software.constructs.Construct;

public class KubernetesNodePortService extends Construct {
    public final Service service;

    public KubernetesNodePortService(@NotNull Construct scope, @NotNull String id,
            @NotNull KubernetesNodePortServiceConfig config) {
        super(scope, id);

        this.service = new Service(this, id, ServiceConfig.builder()
                .metadata(ServiceMetadata.builder()
                        .name(String.format("%s-%s-%s", config.app(),
                                config.component(), config.environment()))
                        .build())
                .spec(ServiceSpec.builder()
                        .type("NodePort")
                        .port(List.of(
                                ServiceSpecPort.builder()
                                        .port(80)
                                        .targetPort("80")
                                        .nodePort(config.port())
                                        .protocol("TCP")
                                        .build()))
                        .selector(Map.of(
                                "app", config.app(),
                                "component", config.component(),
                                "environment", config.environment()))
                        .build())
                .build());
    }

}
