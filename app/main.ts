import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import {
  KubernetesProvider,
//  Deployment,
  // Ingress,
  Pod,
  Service,
  } from "@cdktf/provider-kubernetes";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new KubernetesProvider(this, "kind", {
      configPath: "~/.kube/config"
    });

    new Pod(this, "myapp-pod", {
      metadata: [
        {
          labels:
            {
              app: "myapp",
            },
          name: "myapp",
        },
      ],
      spec: [
        {
          container: [
            {
              image: "nginx:latest",
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
              port: 8080,
              targetPort: "80",
              protocol: "TCP",
            },
          ],
          selector:
            {
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
