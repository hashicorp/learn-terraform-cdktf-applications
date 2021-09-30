import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import {
  KubernetesProvider,
  Deployment,
  // Ingress,
  //  Pod,
  Service,
} from "@cdktf/provider-kubernetes";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new KubernetesProvider(this, "kind", {
      configPath: "~/.kube/config",
    });

    new Deployment(this, "myapp-deployment", {
      metadata: [
        {
          labels: {
            app: "myapp",
          },
          name: "myapp",
        },
      ],
      spec: [
        {
          replicas: "2",
          selector: [
            {
              matchLabels: { app: "myapp" },
            },
          ],
          template: [
            {
              metadata: [
                {
                  labels: {
                    app: "myapp",
                  },
                },
              ],
              spec: [
                {
                  container: [
                    {
                      image: "nginx:latest",
//                      imagePullPolicy: "never", // for local images
                      name: "myapp",
                      port: [
                        {
                          containerPort: 80,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    new Service(this, "myapp-service", {
      metadata: [
        {
          name: "myapp",
        },
      ],
      spec: [
        {
          type: "NodePort",
          port: [
            {
              port: 80,
              targetPort: "80",
              nodePort: 30001,
              protocol: "TCP"
            },
          ],
          selector: {
            app: "myapp",
          },
        },
      ],
    });

    // new Ingress(this, "myapp-ingress", {
    //   metadata: [
    //     {
    //       name: "myapp",
    //       // annotations: {
    //       //   "kubernetes.io/ingress.class": "nginx"
    //       // }
    //     },
    //   ],
    //   spec: [
    //     {
    //      backend: [
    //        {
    //         serviceName: "myapp",
    //         servicePort: "80"
    //        }
    //      ]
    //   }
    //   ],
    // });
  }
}

const app = new App();
new MyStack(app, "app");
app.synth();
