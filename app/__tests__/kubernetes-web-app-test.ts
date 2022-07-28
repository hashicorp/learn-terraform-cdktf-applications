import "cdktf/lib/testing/adapters/jest"
import { Testing } from "cdktf"
import * as kubernetes from "@cdktf/provider-kubernetes"
import {
  KubernetesWebAppDeployment,
  KubernetesNodePortService,
  SimpleKubernetesWebApp,
 } from "../constructs"

describe('Our CDKTF Constructs', () => {
  describe('KubernetesWebAppDeployment', () => {
    it('should contain a deployment resource', () => {
      expect(
        Testing.synthScope((scope) => {
          new KubernetesWebAppDeployment(scope, 'myapp-frontend-dev', {
            image: 'nginx:latest',
            replicas: 4,
            app: 'myapp',
            component: 'frontend',
            environment: 'dev',
          })
        })
      ).toHaveResource(kubernetes.Deployment)
    })
  })
  describe('KubernetesNodePortService', () => {
    it('should contain a Service resource', () => {
      expect(
        Testing.synthScope((scope) => {
          new KubernetesNodePortService(scope, 'myapp-frontend-dev', {
            app: 'myapp',
            component: 'frontend',
            environment: 'dev',
            port: 30001,
          })
        })
      ).toHaveResource(kubernetes.Service)
    })
  })
  describe('SimpleKubernetesWebApp', () => {
    it('should contain a Service resource', () => {
      expect(
        Testing.synthScope((scope) => {
          new SimpleKubernetesWebApp(scope, 'myapp-frontend-dev', {
            image: 'nginx:latest',
            replicas: 4,
            app: 'myapp',
            component: 'frontent',
            environment: 'dev',
            port: 30001,
          })
        })
      ).toHaveResource(kubernetes.Service)
    })
    it('should contain a Deployment resource', () => {
      expect(
        Testing.synthScope((scope) => {
          new SimpleKubernetesWebApp(scope, 'myapp-frontend-dev', {
            image: 'nginx:latest',
            replicas: 4,
            app: 'myapp',
            component: 'frontent',
            environment: 'dev',
            port: 30001,
          })
        })
      ).toHaveResource(kubernetes.Deployment)
    })
  })  
})
