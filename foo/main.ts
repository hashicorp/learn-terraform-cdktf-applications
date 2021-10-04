import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import * as path from 'path';
import * as kubernetes from "./.gen/providers/kubernetes";

import {
  // KubernetesWebAppDeployment,
  // KubernetesNodePortService,
  SimpleKubernetesWebApp,
} from './constructs';

//import * as kubernetes from "@cdktf/provider-kubernetes";
// import {
//   Deployment,
// } from "@cdktf/provider-kubernetes";

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

    new SimpleKubernetesWebApp(this, name + "-backend", {
      image: "nginx:latest",
      replicas: "2",
      port: 30002,
      appName: "myapp-backend",
      environment: "dev"
    });

    // new KubernetesWebAppDeployment(this, name + "-deployment", 
    //   {image: "nginx:latest", replicas: "2", appName: "myapp", environment: "dev"}
    // );

    // new KubernetesNodePortService(this, name + "-service",
    //   {port: 30001, appName: "myapp", environment: "dev"}
    // );

  }
}

const app = new App();
new MyStack(app, "app");
app.synth();
