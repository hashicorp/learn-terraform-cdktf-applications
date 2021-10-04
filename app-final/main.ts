import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import {
  KubernetesProvider,
//  Deployment,
//  Ingress,
//  Pod,
//  Service,
} from "@cdktf/provider-kubernetes";

import {
  SimpleWebApp,
  // KubernetesDeployment,
  // KubernetesNodePortService,
} from './constructs'

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new KubernetesProvider(this, "kind", {
      configPath: "~/.kube/config",
    });

    // new KubernetesDeployment(this, name + "-deployment", {image: "nginx:latest", replicas: "2", appName: "myapp"});
    // new KubernetesNodePortService(this, name + "-service", {port: 30002, appName: "myapp"});

    new SimpleWebApp(this, "frontend", {
      image: "localhost:5000/nocorp-web:1.1",
      replicas: "2",
      port: 30001,
      appName: "myapp-frontend"
    });

    new SimpleWebApp(this, "backend", {
      image: "nginx:latest",
      replicas: "2",
      port: 30002,
      appName: "myapp-backend"
    });
  }
}

const app = new App();
new MyStack(app, "app");
app.synth();
