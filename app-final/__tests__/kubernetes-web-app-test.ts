import "cdktf/lib/testing/adapters/jest";
import { Testing } from "cdktf";
import * as kubernetes from "@cdktf/provider-kubernetes";

import {
  KubernetesWebAppDeployment,
  KubernetesNodePortService,
  SimpleKubernetesWebApp,
} from "../constructs";

describe("Our CDKTF Constructs", () => {
  describe("KubernetesWebAppDeployment", () => {
    it("should contain a deployment resource", () => {
      const result = Testing.synthScope((scope) => {
        new KubernetesWebAppDeployment(scope, "myapp-frontend-dev", {
          image: "nginx:latest",
          replicas: "4",
          appName: "myapp",
          environment: "dev",
          env: { ENV_VAR_KEY: "env_var_value" },
        });
      });

      expect(result).toHaveResource(kubernetes.Deployment);

      // works but is hard to write and hard to read
      expect(result).toHaveResourceWithProperties(kubernetes.Deployment, {
        spec: expect.arrayContaining([
          expect.objectContaining({
            template: expect.arrayContaining([
              expect.objectContaining({
                spec: expect.arrayContaining([
                  expect.objectContaining({
                    container: expect.arrayContaining([
                      expect.objectContaining({
                        env: expect.arrayContaining([
                          expect.objectContaining({
                            name: "ENV_VAR_KEY",
                            value: "env_var_value",
                          }),
                        ]),
                      }),
                    ]),
                  }),
                ]),
              }),
            ]),
          }),
        ]),
      });

      // Doing it manually instead:
      // result is a string containing the synthesized json
      const json = JSON.parse(result);
      // the hash (39E8AC92) is stable between runs (it is based on the name of the construct and its scope)
      expect(json).toHaveProperty(
        "resource.kubernetes_deployment.myapp-frontend-dev_39E8AC92.spec.0.template.0.spec.0.container.0.env.0",
        expect.objectContaining({ name: "ENV_VAR_KEY", value: "env_var_value" })
      );

      // snapshot test example
      // it was initially written as `expect(json).toMatchInlineSnapshot();`
      // and on the first run jest added the content inline, can be updated by running "npm test -u"
      expect(result).toMatchInlineSnapshot(`
"{
  \\"resource\\": {
    \\"kubernetes_deployment\\": {
      \\"myapp-frontend-dev_39E8AC92\\": {
        \\"metadata\\": [
          {
            \\"labels\\": {
              \\"app\\": \\"myapp\\",
              \\"environment\\": \\"dev\\"
            },
            \\"name\\": \\"myapp\\"
          }
        ],
        \\"spec\\": [
          {
            \\"replicas\\": \\"4\\",
            \\"selector\\": [
              {
                \\"match_labels\\": {
                  \\"app\\": \\"myapp\\",
                  \\"environment\\": \\"dev\\"
                }
              }
            ],
            \\"template\\": [
              {
                \\"metadata\\": [
                  {
                    \\"labels\\": {
                      \\"app\\": \\"myapp\\",
                      \\"environment\\": \\"dev\\"
                    }
                  }
                ],
                \\"spec\\": [
                  {
                    \\"container\\": [
                      {
                        \\"env\\": [
                          {
                            \\"name\\": \\"ENV_VAR_KEY\\",
                            \\"value\\": \\"env_var_value\\"
                          }
                        ],
                        \\"image\\": \\"nginx:latest\\",
                        \\"name\\": \\"myapp\\"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}"
`);
    });
  });
  describe("KubernetesNodePortService", () => {
    it("should contain a Service resource", () => {
      expect(
        Testing.synthScope((scope) => {
          new KubernetesNodePortService(scope, "myapp-frontend-dev", {
            appName: "myapp",
            environment: "dev",
            port: 30001,
          });
        })
      ).toHaveResource(kubernetes.Service);
    });
  });

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
});
