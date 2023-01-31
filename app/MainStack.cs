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


            new SimpleKubernetesWebApp(this, "app_frontend", new SimpleKubernetesWebAppConfig
            {
                Image = "nginx:latest",
                Replicas = 3,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
                Port = 30001,
                Env = new Dictionary<string, string> { }
            });
        }
    }
}