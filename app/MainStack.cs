using System;
using System.IO;
using System.Collections.Generic;
using Constructs;
using HashiCorp.Cdktf;
using HashiCorp.Cdktf.Providers.Kubernetes.Provider;
using HashiCorp.Cdktf.Providers.Kubernetes.Deployment;


namespace MyCompany.MyApp
{
    class MainStack : TerraformStack
    {
        public MainStack(Construct scope, string id) : base(scope, id)
        {
            new KubernetesProvider(this, "k8s", new KubernetesProviderConfig
            {
                ConfigPath = Path.Join(Environment.CurrentDirectory, "../kubeconfig.yaml"),
            });


            new KubernetesWebAppDeployment(this, "deployment", new KubernetesWebAppDeploymentConfig
            {
                Image = "nginx:latest",
                Replicas = 2,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
                Env = new Dictionary<string, string> { }
            });

            new KubernetesNodePortService(this, "service", new KubernetesNodePortServiceConfig
            {
                Port = 30001,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
            });
        }
    }
}