import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import * as kubernetes from "../.gen/providers/kubernetes";
import {
  KubernetesWebAppDeployment,
  KubernetesNodePortService,
} from "../constructs";
import "cdktf/lib/testing/adapters/jest"; // This is needed to get Typescript types for the new matchers

describe("Our CDKTF Constructs", () => {
  
  describe("KubernetesDeployment", () => {
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
});
