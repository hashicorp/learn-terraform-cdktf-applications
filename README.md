# Develop applications with CDKTF

Note: Still very much WIP/rough notes, not ready to run yet.

1. Run a local docker registry
    See docs/script at: https://kind.sigs.k8s.io/docs/user/local-registry/

    Is it running?

    ```sh
    docker ps --filter name=local-registry
    ```

    No?

    ```sh
    docker run -d --restart=always -p "127.0.0.1:5000:5000" --name local-registry registry:2
    ```

1. Create cluster

    ```sh
    kind create cluster --name=cdktf-app --config=kind-config.yaml
    ```

1. Attach local registry to kind's network.

    ```sh
    docker network connect kind local-registry
    ```

1. Add configmap for registry.

    ```sh
    kubectl apply -f local-registry-configmap.yaml
    ```

1. Install CDKTF libraries, CLI, and constructs (peer dependency)

    ```sh
    npm install -g cdktf-cli@latest cdktf@latest constructs@^10.0.0
    ```

1. Go into the app directory.

    ```sh
    cd app
    ```

1. Initialize CDKTF app (starting from empty directory).

    ```sh
    cdktf init --template=typescript --project-name=learn-terraform-cdktf-applications --project-description="Learn how to develop CDKTF applications" --local
    ```

1. Install docker provider.

    ```sh
    npm install @cdktf/provider-kubernetes
    ```

1. Add provider to `cdktf.json`:

    ```json
    {
      "language": "typescript",
      "app": "npm run --silent compile && node main.js",
      "projectId": "9e131c9e-f878-4dde-84dd-88218e539bea",
      "terraformProviders": ["hashicorp/kubernetes ~> 2.5.0"],
      "terraformModules": [],
      "context": {
        "excludeStackIdFromLogicalIds": "true",
    "allowSepCharsInLogicalIds": "true"
      }
    }
    ```

1. Run cdktf get to generate typescript constructs for your provider.

    ```sh
    cdktf get
    ```

1. Synth

    ```sh
    cdktf synth
    ```

1. Deploy

    ```sh
    cdktf deploy
    ```

