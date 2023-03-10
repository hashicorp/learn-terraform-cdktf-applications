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
        public MainStack(Construct scope, string id, SimpleKubernetesWebAppConfig frontendConfig, SimpleKubernetesWebAppConfig backendConfig) : base(scope, id)
        {
            new KubernetesProvider(this, "k8s", new KubernetesProviderConfig
            {
                ConfigPath = Path.Join(Environment.CurrentDirectory, "../kubeconfig.yaml"),
            });

            SimpleKubernetesWebApp appBackend = new SimpleKubernetesWebApp(this, "app_backend", backendConfig);

            new SimpleKubernetesWebApp(this, "app_frontend", new SimpleKubernetesWebAppConfig
            {
                Image = frontendConfig.Image,
                Replicas = frontendConfig.Replicas,
                App = frontendConfig.App,
                Component = frontendConfig.Component,
                Environment = frontendConfig.Environment,
                Port = frontendConfig.Port,
                Env = new Dictionary<string, string> {
                    { "BACKEND_URL", $"http://localhost:{appBackend.Config.Port}" }
                }
            });
        }
    }
}