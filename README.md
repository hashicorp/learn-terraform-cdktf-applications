# Develop applications with CDKTF

## Lab system setup/prerequisites

1. Install & run Docker.

1. Run a local docker registry.

    We want the scenario to run without entering credentials, so use a local
    registry instead of Dockerhub.

    Based on docs/script at: https://kind.sigs.k8s.io/docs/user/local-registry/

    Is it running?

    ```sh
    docker ps --filter name=local-registry
    ```

   No?

   <!-- 
   FIXME: Probably not needed: registry with auth

   Make Auth dir:

    ```sh
    mkdir auth
    ```

   Create htpasswd file:

    ```sh
    docker run --entrypoint htpasswd httpd:2 -Bbn terraform testpassword > auth/htpasswd
    ```

   Run local registry:

    ```sh
    docker run -d --restart always -p "127.0.0.1:5000:5000" --name local-registry -v "$(pwd)/auth:/auth" -e "REGISTRY_AUTH=htpasswd" -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd registry:2
    ``` -->

   Run local registry:

    ```sh
    docker run -d --restart always -p "127.0.0.1:5000:5000" --name local-registry registry:2
    ```

1. Install kind.

1. Create cluster

    ```sh
    kind create cluster --name cdktf-app --config kind-config.yaml
    ```

1. Save cluster config

   FIXME: Or just rely on default kubeconfig location. Will users care?

    ```sh
    kubectl config view --raw --context kind-cdktf-app > kubeconfig.yaml
    ```

1. Attach local registry to kind's network.

    ```sh
    docker network connect kind local-registry
    ```

1. Add configmap for registry.

    ```sh
    kubectl apply -f local-registry-configmap.yaml --kubeconfig kubeconfig.yaml
    ```

## Lab scenario

1. Install CDKTF libraries, CLI, and constructs (peer dependency)

    ```sh
    npm install -g cdktf-cli@latest cdktf@latest constructs@^10.0.0
    ```

**Note:** Final version is in `app-final`, or follow these steps:

1. Create & go into the app directory.

    ```sh
    mkdir app
    cd app
    ```

1. Initialize CDKTF app (starting from empty `app` directory).

    ```sh
    cdktf init --template=typescript \
               --project-name=learn-terraform-cdktf-applications \
               --project-description="Learn how to develop CDKTF applications" \
               --local
    ```

1. Install kubernetes provider.

    ```sh
    npm install @cdktf/provider-kubernetes
    ```

<!-- 
   FIXME: Not needed with provider installed from NPM.
   
   1. Add provider to `cdktf.json`. Should look similar to:

    ```json
    {
      "language": "typescript",
      "app": "npm run --silent compile && node main.js",
      "projectId": "9e131c9e-f878-4dde-84dd-88218e539bea",
      "terraformProviders": ["hashicorp/kubernetes@ ~> 2.5.0"],
      "terraformModules": [],
      "context": {
        "excludeStackIdFromLogicalIds": "true",
    "allowSepCharsInLogicalIds": "true"
      }
    }
    ```

1. Run cdktf get to generate typescript constructs for the k8s provider.
   **FIXME:** Is this needed w/ provider installed via NPM?

    ```sh
    cdktf get
    ```
-->

1. Add a Construct representing a Kubernetes Deployment.

    First, convert some example Terraform config (or read the cdktf/kubernetes
    provider docs).

    ```sh
    cat ../k8s_deployment.tf | cdktf convert
    ```

    **Note:** Output needs to be tweaked before incorporating into code:
    
    1. Replace `// define resources here` in `app/main.ts` with 
       `new kubernetes.Deployment(this, name + "-deployment", { ... });`.
       1. Change `"myapp"` to `name + "-deployment"` ^
    1. Add import `import * as kubernetes from "@cdktf/provider-kubernetes";`
       to imports near top of file.
    1. Add import `import * as path from 'path';` to imports near top of file.       
    1. Remove extra `[]` from `metadata.labels`, `spec.selector.matchLabels`,
       and `spec.template.metadata.labels` in `Deployment` config.
       1. Syntax highlighting should show where errors are.
       1. **FIXME:** Is there a way to fix/work around this?
    1. Add k8s provider (above `Deployment` block).
        ```typescript
        new kubernetes.KubernetesProvider(this, "kind", {
          configPath: path.join(__dirname, '../kubeconfig.yaml'),
        });
        ```

1. Synth

    ```sh
    cdktf synth
    ```
   
   **FIXME:** `cdktf deploy` always says it's synthesizing. When do we need to run `cdktf synth` first vs just `cdktf deploy`?

1. Deploy

    ```sh
    cdktf deploy
    ```

1. Show the pod

    ```sh
    kubectl get pods --kubeconfig ../kubeconfig.yaml
    ```

1. Ask for four replicas in `app/main.tf`, redeploy.

    ```typescript
    //          replicas: "1",
              replicas: "4",
    ```

    Deploy (will synth as needed):

    ```sh
    cdktf deploy
    ```

    Check (Should show 4 pods now, the new three younger than the first one):

    ```sh
    kubectl get pods --kubeconfig ../kubeconfig.yaml
    ```

1. Convert the "raw" Deployment to a construct with a nicer interface.

    ```sh
    mkdir constructs
    ```

    Add new file `constructs/kubernetes-web-app.ts`:

    ```typescript
    import { Construct } from "constructs";
    import * as kubernetes from "@cdktf/provider-kubernetes";

    export interface KubernetesWebAppDeploymentConfig {
      readonly image: string;
      readonly replicas: string;
      readonly appName: string;
      readonly environment: string;
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
    ```

    And in `constructs/index.ts`.

    ```typescript
    export * from './kubernetes-web-app';
    ```

    Back in `app/main.ts`, import construct near top of file:
    
    ```typescript
    import {
      KubernetesWebAppDeployment,
    } from './constructs'
    ```

    And replace `new kubernetes.Deployment(this, name + "-deployment", { ... });` with construct:

    ```typescript
    new KubernetesWebAppDeployment(this, `${name}-deployment`,
      {image: "nginx:latest", replicas: "2", appName: "myapp", environment: "dev"}
    );
    ```

    Deploy:

    ```sh
    cdktf deploy
    ```

1. Add a test.

   First, configure testing in new file `app/jest.setup.js`:

   ```javascript
    const cdktf = require("cdktf");
    cdktf.Testing.setupJest();
   ```

   Create new file `__tests__/kubernetes-web-app-test.ts`.

    ```typescript
    import "cdktf/lib/testing/adapters/jest";
    import { Testing } from "cdktf";
    import * as kubernetes from "../.gen/providers/kubernetes";
    import {
      KubernetesWebAppDeployment,
    } from "../constructs";

    describe("Our CDKTF Constructs", () => {
    
    describe("KubernetesWebAppDeployment", () => {
        it("should contain a deployment resource", () => {
        expect(
            Testing.synthScope((scope) => {
            new KubernetesWebAppDeployment(scope, "myapp-frontend-dev", {
                image: "nginx:latest",
                replicas: "4",
                appName: "myapp",
                environment: "dev"
            });
            })
        ).toHaveResource(kubernetes.Deployment);
        });
    });
    });
    ```

    Run tests from `app/` directory.

    ```sh
    npm run test
    ```

    Now, watch the tests.

    ```sh
    npm run test:watch
    ```

    (Open a new tab to run further commands).

1. Now, `nginx:latest` is runnning in your deployment, but it isn't accessible.
   Add a kubernetes `Service` configured as a NodePort to make it available on
   port 30001. In `app/constructs/kubernetes-web-app.ts`.

   Add interface for service:

    ```typescript
    export interface KubernetesNodePortServiceConfig {
      readonly port: number;
      readonly appName: string;
      readonly environment: string;
    };
    ```

   Define the new construct class.

    ```typescript
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
    ```

   Now add a test to `app/__tests__/kubernetes-web-app.ts`.

   Update imports w/ service:

    ```typescript
    import {
      KubernetesWebAppDeployment,
      KubernetesNodePortService,
    } from "../constructs";
    ```
    
    And the test itself:

    ```typescript
    describe("KubernetesNodePortService", () => {
      it("should contain a Service resource", () => {
        expect(
          Testing.synthScope((scope) => {
            new KubernetesNodePortService(scope, "myapp-frontend-dev", {
              appName: "myapp",
              environment: "dev",
              port: 30001
            });
          })
        ).toHaveResource(kubernetes.Service);
      });
    });
    ```

   **FIXME:** Ideas for other things/ways to test?

   Check to make sure the test still pass in `npm run test:watch` command. (2 tests passed)

   Add service to `app/main.tf` imports:

    ```typescript
    import {
      KubernetesWebAppDeployment,
      KubernetesNodePortService,
    } from './constructs';
    ```

   And use it right after `KubernetesWebAppDeployment`:

    ```typescript
    new KubernetesNodePortService(this, name + "-service",
      {port: 30001, appName: "myapp", environment: "dev"}
    );
    ```

   Deploy:

    ```sh
    cdktf deploy
    ```

   Visit `localhost:30001` to see nginx hello world page. Might take a minute or
   two before it's available.

1. Refactor constructs into a `SimpleKubernetesWebApp` that includes both components.

   In `app/constructs/kubernetes-web-app.ts`:

    ```typescript
    export class SimpleKubernetesWebApp extends Construct {
    public readonly deployment: KubernetesWebAppDeployment;
    public readonly service: KubernetesNodePortService;
    public readonly config: KubernetesWebAppDeploymentConfig & KubernetesNodePortServiceConfig;

    constructor(scope: Construct, name: string, config: KubernetesWebAppDeploymentConfig & KubernetesNodePortServiceConfig) {
      super(scope, name);

      this.config = config;
      this.deployment = new KubernetesWebAppDeployment(this, `${name}-deployment`,
        {image: config.image, replicas: config.replicas, appName: config.appName, environment: config.environment}
      );

      this.service = new KubernetesNodePortService(this, `${name}-service`,
        {port: config.port, appName: config.appName, environment: config.environment}
      );
    }};
    ```

1. Add a test for `SimpleKubernetesWebApp`.

   Add import:

    ```typescript
    import {
      KubernetesWebAppDeployment,
      KubernetesNodePortService,
      SimpleKubernetesWebApp
    } from "../constructs";
    ```

   And tests:

    ```typescript
    describe("SimpleKubernetesWebApp", () => {
      it("should contain a Service resource", () => {
        expect(
          Testing.synthScope((scope) => {
            new SimpleKubernetesWebApp(scope, "myapp-frontend-dev", {
              image: "nginx:latest",
              replicas: "4",
              appName: "myapp",
              environment: "dev",
              port: 30001,
            });
          })
        ).toHaveResource(kubernetes.Service);
      });
    });

    describe("SimpleKubernetesWebApp", () => {
      it("should contain a Deployment resource", () => {
        expect(
          Testing.synthScope((scope) => {
            new SimpleKubernetesWebApp(scope, "myapp-frontend-dev", {
              image: "nginx:latest",
              replicas: "4",
              appName: "myapp",
              environment: "dev",
              port: 30001,
            });
          })
        ).toHaveResource(kubernetes.Deployment);
      });
    });
    ```

   Now update `app/main.ts` to use new construct instead of seperate ones.

    ```typescript
    import {
    // KubernetesWebAppDeployment,
    // KubernetesNodePortService,
      SimpleKubernetesWebApp,
    } from './constructs';
    ```

   And replace the old constructs with the new one:

    ```typescript
    new SimpleKubernetesWebApp(this, `${name}-frontend`, {
      image: "nginx:latest",
      replicas: "2",
      port: 30001,
      appName: "myapp-frontend",
      environment: "dev"
    });
    ```

   **Note:** Bug? Unless we `cdktf destroy` first, we get the following error on `cdktf deploy`:

    ```sh
    [2021-10-04T13:08:41.453] [ERROR] default - ╷
    │ Error: Service "myapp-frontend" is invalid: spec.ports[0].nodePort: Invalid value: 30001: provided port is already allocated
    │ 
    │   with kubernetes_service.app-frontend_app-frontend-service_C4A54401,
    │   on cdk.tf.json line 108, in resource.kubernetes_service.app-frontend_app-frontend-service_C4A54401:
    │  108:       }
    ⠹ Deploying Stack: app
    ```

   **FIXME:** If we don't get a fix for the above, workaround is to update the port to 30002.
    
   Watch: (Maybe start this earlier)
 
    ```sh
    cdktf watch --auto-approve
    ```

   Visit `localhost:30001` to see nginx page. (Or :30002)

   Add an output, to `constructs/kubernetes-web-app.ts`.

   Add near top of file:

    ```typescript
    import { TerraformOutput } from "cdktf";
    ```

   Add inside SimpleKubernetesWebApp's `constructor({...});`:

    ```typescript
    new TerraformOutput(this, `${name}-frontend-url`, {
      value: `http://localhost:${config.port}`,
    });
    ```

   **FIXME:** I haven't found a way to get cdktf to print the output more than once - the first time the config is deployed. It isn't output at all with `cdktf watch`, afaict. :(

1. Deploy custom image.

   Visit `frontend` directory:

    ```sh
    cd ../frontend
    ```

   Build:

    ```sh
    docker build . -t nocorp-frontend
    ```

   Tag:

    ```sh
    docker tag nocorp-frontend:latest localhost:5000/nocorp-frontend:latest
    ```

   Push (to local registry):

    ```sh
    docker push localhost:5000/nocorp-frontend:latest
    ```

   FIXME: Automate that^^ ?

   Use image in `app/main.ts`:

    ```typescript
    new SimpleKubernetesWebApp(this, `${name}-frontend`, {
      image: "localhost:5000/nocorp-frontend:latest",
      // image: "nginx:latest",
      replicas: "2",
      port: 30001,
      appName: "myapp-frontend",
      environment: "dev"
    });
    ```

   Back in `app` directory:

    ```sh
    cd ../app
    ```

   Deploy:

    ```sh
    cdktf deploy
    ```

   (http://localhost:30001 - service might take a few seconds to deploy, but should now be terranomo)


1. Build & deploy backend

   Visit `backend` directory:

    ```sh
    cd ../backend
    ```

   Build:

    ```sh
    docker build . -t nocorp-backend
    ```

   Tag:

    ```sh
    docker tag nocorp-backend:latest localhost:5000/nocorp-backend:latest
    ```

   Push (to local registry):

    ```sh
    docker push localhost:5000/nocorp-backend:latest
    ```

   And add a new "app":

    ```typescript
    new SimpleKubernetesWebApp(this, `${name}-backend`, {
      image: "localhost:5000/nocorp-backend:latest",
      replicas: "1",
      port: 30002,
      appName: "myapp-backend",
      environment: "dev"
    });
    ```

<!-- FIXME: Can't get this to work. :)

  1. Automatically build/detect new images

   Install docker provider:

    ```sh
    npm install @cdktf/provider-docker
    ```

  Add to `cdktf.json`:

    ```json
    "terraformProviders": [
      "hashicorp/kubernetes@ ~> 2.5.0",
      "kreuzwerker/docker@ ~> 2.15.0"
    ],
    ```

  Run `cdktf get`:

   ```sh
   cdktf get
   ```
 -->


1. TODO:
    1. Deploy frontend/backend that talk to each other
    1. Deploy another "stack"
    1. Deploy app on public cloud

