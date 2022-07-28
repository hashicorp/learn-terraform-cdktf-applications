import { Construct } from "constructs"
import { App, TerraformStack } from "cdktf"
import * as kubernetes from "@cdktf/provider-kubernetes"
import * as path from "path"

import { SimpleKubernetesWebApp } from "./constructs"

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new kubernetes.KubernetesProvider(this, 'kind', {
      configPath: path.join(__dirname, '../kubeconfig.yaml'),
    })

    // const backend_app = new SimpleKubernetesWebApp(this, 'backend', {
    //   image: 'localhost:5000/nocorp-backend:latest',
    //   replicas: 1,
    //   port: 30002,
    //   app: 'myapp',
    //   component: 'backend',
    //   environment: 'dev',
    // })

    new SimpleKubernetesWebApp(this, 'frontend', {
      image: 'localhost:5000/nocorp-frontend:latest',
      replicas: 3,
      port: 30001,
      app: 'myapp',
      component: 'frontend',
      environment: 'dev',
      // env: { BACKEND_APP_URL: `http://localhost:${backend_app.config.port}` },
    })

  }
}

const app = new App()
new MyStack(app, "app")
app.synth()
