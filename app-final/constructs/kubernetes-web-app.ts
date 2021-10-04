import { Construct } from "constructs";
import {
  Deployment,
  Service,
} from "@cdktf/provider-kubernetes";

export interface KubernetesDeploymentConfig {
  readonly image: string;
  readonly replicas: string;
  readonly appName: string;
};

export interface KubernetesNodePortServiceConfig {
  readonly port: number;
  readonly appName: string;
};

export interface SimpleWebAppConfig {
  readonly image: string;
  readonly replicas: string;
  readonly port: number;
  readonly appName: string;
};

export class SimpleWebApp extends Construct {
  public readonly deployment: KubernetesDeployment;
  public readonly service: KubernetesNodePortService;

  constructor(scope: Construct, name: string, config: SimpleWebAppConfig) {
    super(scope, name);

    this.deployment = new KubernetesDeployment(this, name + "-deployment", {image: config.image, replicas: config.replicas, appName: config.appName});
    this.service = new KubernetesNodePortService(this, name + "-service", {port: config.port, appName: config.appName});
  };
};

export class KubernetesDeployment extends Construct {
  public readonly resource: Deployment;

  constructor(scope: Construct, name: string, config: KubernetesDeploymentConfig) {
    super(scope, name);

    this.resource = new Deployment(this, name, {
      metadata: [
        {
          labels:
// FIXME: `cat ../k8s_deployment.tf | cdktf convert` generates this as a list `[]`, but
// the provider bindings require just the object `{}`.
//
//          [
            {
              app: config.appName,
              environment: "dev",
            },
//          ],
          name: config.appName,
        },
      ],
      spec: [
        {
          replicas: config.replicas,
          selector: [
            {
              matchLabels:
//              [
                {
                  environment: "dev",
                  app: config.appName
                },
//              ],
            },
          ],
          template: [
            {
              metadata: [
                {
                  labels: {
                    app: config.appName,
                    environment: "dev"
                  },
                },
              ],
              spec: [
                {
                  container: [
                    {
                      image: config.image,
//                      imagePullPolicy: "never", // for local images
                      name: config.appName,
                      // port: [
                      //   {
                      //     containerPort: 80,
                      //   },
                      // ],
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
  public readonly resource: Service;

  constructor(scope: Construct, name: string, config: KubernetesNodePortServiceConfig) {
    super(scope, name);

    this.resource = new Service(this, name, {
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
