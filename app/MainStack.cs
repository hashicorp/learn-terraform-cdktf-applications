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

            SimpleKubernetesWebApp appBackend = new SimpleKubernetesWebApp(this, "app_backend", new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-backend:latest",
                Replicas = 1,
                App = "myapp",
                Component = "backend",
                Environment = "dev",
                Port = 30002,
                Env = new Dictionary<string, string> { }
            });

            new SimpleKubernetesWebApp(this, "app_frontend", new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-frontend:latest",
                Replicas = 3,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
                Port = 30001,
                Env = new Dictionary<string, string> {
                    { "BACKEND_URL", $"http://localhost:{appBackend.Config.Port}" }
                }
            });
        }
    }
}