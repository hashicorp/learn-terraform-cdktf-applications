import { Construct } from "constructs";
import * as kubernetes from "../.gen/providers/kubernetes";
import { TerraformOutput } from "cdktf";

export interface KubernetesWebAppDeploymentConfig {
  readonly image: string;
  readonly replicas: string;
  readonly appName: string;
  readonly environment: string;
};

export interface KubernetesNodePortServiceConfig {
    readonly port: number;
    readonly appName: string;
    readonly environment: string;
};

export class SimpleKubernetesWebApp extends Construct {
    public readonly deployment: KubernetesWebAppDeployment;
    public readonly service: KubernetesNodePortService;
    public readonly config: KubernetesWebAppDeploymentConfig & KubernetesNodePortServiceConfig;

    constructor(scope: Construct, name: string, config: KubernetesWebAppDeploymentConfig & KubernetesNodePortServiceConfig) {
        super(scope, name);

        this.config = config;
        this.deployment = new KubernetesWebAppDeployment(this, name + "-deployment",
        {image: config.image, replicas: config.replicas, appName: config.appName, environment: config.environment}
        );

        this.service = new KubernetesNodePortService(this, name + "-service",
          {port: config.port, appName: config.appName, environment: config.environment}
        );

        new TerraformOutput(this, "frontend_url", {
            value: "http://localhost:" + config.port.toString(),
          });
      
    }
};

export class KubernetesWebAppDeployment extends Construct {
  public readonly resource: kubernetes.Deployment;

  constructor(scope: Construct, name: string, config: KubernetesWebAppDeploymentConfig) {
    super(scope, name);

    this.resource = new kubernetes.Deployment(this, name, {
    metadata: [
        {
        labels:
            {
            app: config.appName,
            environment: config.environment,
            },
        name: config.appName,
        },
    ],
    spec: [
        {
        replicas: config.replicas,
        selector: [
            {
            matchLabels:
                {
                environment: config.environment,
                app: config.appName
                },
            },
        ],
        template: [
            {
            metadata: [
                {
                labels: {
                    app: config.appName,
                    environment: config.environment
                },
                },
            ],
            spec: [
                {
                container: [
                    {
                    image: config.image,
                    name: config.appName,
                    },
                ],
                },
            ],
            },
        ],
        },
    ],
    });
}
};

export class KubernetesNodePortService extends Construct {
    public readonly resource: kubernetes.Service;

    constructor(scope: Construct, name: string, config: KubernetesNodePortServiceConfig) {
    super(scope, name);

    this.resource = new kubernetes.Service(this, name, {
        metadata: [
        {
            name: config.appName,
        },
        ],
        spec: [
        {
            type: "NodePort",
            port: [
            {
                port: 80,
                targetPort: "80",
                nodePort: config.port,
                protocol: "TCP"
            },
            ],
            selector: {
            app: config.appName,
            },
        },
        ],
    });
    };
};    
