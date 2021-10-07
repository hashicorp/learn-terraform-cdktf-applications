import { Construct } from "constructs";
import {
  App,
  TerraformStack,
  TerraformOutput
} from "cdktf";

//import * as kubernetes from "./.gen/providers/kubernetes";
import * as kubernetes from "@cdktf/provider-kubernetes";
//import * as docker from "@cdktf/provider-docker"

import * as path from "path";

import {
  // KubernetesWebAppDeployment,
  // KubernetesNodePortService,
  SimpleKubernetesWebApp,
} from "./constructs";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new kubernetes.KubernetesProvider(this, "kind", {
      configPath: path.join(__dirname, "../kubeconfig.yaml"),
    });

    // FIXME: I tried a few things to get the docker provider working with the local registry.
    // Goal: either of these:
    //  - build and push to the local registry
    //  - Notice when a new image is pushed to the local registry manually, and redeploy the app
    //
    // I couldn't get this to work, though, because of registry auth errors.
    //
    //     new docker.DockerProvider(this, "docker", {
    //       registryAuth: [{
    //         address: "http://localhost:5000",
    // // Assumes user/password auth has been added to local registry:
    //         username: "testuser",
    //         password: "testpassword"
    //     }]});

    //     const dockerImageName = "localhost:5000/nocorp-frontend:latest";

    //     const image = new docker.DataDockerRegistryImage(this, `${name}-image`, {
    //       name: dockerImageName,
    //       insecureSkipVerify: true,
    //       // buildAttribute: [
    //       //   { context: path.resolve(__dirname, "../frontend"),
    //       //     forceRemove: true,
    //       //     authConfig: [{
    //       //        hostName: "localhost",
    //       //        serverAddress: "localhost:5000",
    //       //        userName: "testuser",
    //       //        password: "testpassword"
    //       //     }]
    // //          tag: dockerImageName.split(":")
    //       //   },
    //       // ],
    //     });

    //     new TerraformOutput(this, "frontend_image_sha256", {
    //       value: image.sha256Digest
    //     });

    const backend_app = new SimpleKubernetesWebApp(this, `${name}-backend`, {
      image: "localhost:5000/nocorp-backend:latest",
      replicas: "1",
      port: 30002,
      appName: "myapp-backend",
      environment: "dev",
    });

    new SimpleKubernetesWebApp(this, `${name}-frontend`, {
      image: "localhost:5000/nocorp-frontend:latest",
      replicas: "2",
      port: 30001,
      appName: "myapp-frontend",
      environment: "dev",
      // env: { BACKEND_APP_URL: `http://localhost:${backend_app.config.port}` }
    });

    new TerraformOutput(this, "app-backend-url", {
      value: `http://localhost:${backend_app.config.port}`,
    });

    // new KubernetesWebAppDeployment(this, `${name}-deployment`,
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
