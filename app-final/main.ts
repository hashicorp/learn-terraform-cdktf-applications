import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

import * as kubernetes from "./.gen/providers/kubernetes";
import * as path from 'path';

import {
  // KubernetesWebAppDeployment,
  // KubernetesNodePortService,
    SimpleKubernetesWebApp,
  } from './constructs';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new kubernetes.KubernetesProvider(this, "kind", {
      configPath: path.join(__dirname, '../kubeconfig.yaml'),
    });

    new SimpleKubernetesWebApp(this, name + "-frontend", {
      image: "localhost:5000/nocorp-frontend:latest",
      replicas: "2",
      port: 30001,
      appName: "myapp-frontend",
      environment: "dev"
    });

    // new KubernetesWebAppDeployment(this, name + "-deployment", 
    //   {image: "nginx:latest", replicas: "2", appName: "myapp", environment: "dev"}
    // );

    // new KubernetesNodePortService(this, name + "-service",
    //   {port: 30001, appName: "myapp", environment: "dev"}
    // );

    // new kubernetes.Deployment(this, "myapp", {
    //   metadata: [
    //     {
    //       labels:
    //         {
    //           app: "myapp",
    //           environment: "dev",
    //         },
    //       name: "myapp",
    //     },
    //   ],
    //   spec: [
    //     {
    //       replicas: "4",
    //       selector: [
    //         {
    //           matchLabels:
    //             {
    //               app: "myapp",
    //               environment: "dev",
    //             },
    //         },
    //       ],
    //       template: [
    //         {
    //           metadata: [
    //             {
    //               labels:
    //                 {
    //                   app: "myapp",
    //                   environment: "dev",
    //                 },
    //             },
    //           ],
    //           spec: [
    //             {
    //               container: [
    //                 {
    //                   image: "nginx:latest",
    //                   name: "frontend",
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // });
      }
}

const app = new App();
new MyStack(app, "app-final");
app.synth();
