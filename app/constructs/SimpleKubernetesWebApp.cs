using System;
using System.IO;
using System.Collections.Generic;
using Constructs;
using HashiCorp.Cdktf;
using HashiCorp.Cdktf.Providers.Kubernetes.Deployment;


namespace MyCompany.MyApp
{

    class SimpleKubernetesWebAppConfig
    {
        public string Image { get; set; }
        public int Replicas { get; set; }
        public string App { get; set; }
        public string Component { get; set; }
        public string Environment { get; set; }
        public Dictionary<string, string> Env { get; set; }
        public int Port { get; set; }
    }

    class SimpleKubernetesWebApp : Construct
    {
        public SimpleKubernetesWebAppConfig Config { get; }
        public KubernetesWebAppDeployment Deployment { get; }
        public KubernetesNodePortService Service { get; }

        public SimpleKubernetesWebApp(Construct scope, string id, SimpleKubernetesWebAppConfig config) : base(scope, id)
        {

            this.Config = config;
            this.Deployment = new KubernetesWebAppDeployment(this, "Deployment", new KubernetesWebAppDeploymentConfig
            {
                Image = config.Image,
                Replicas = config.Replicas,
                App = config.App,
                Component = config.Component,
                Environment = config.Environment,
                Env = config.Env
            });

            this.Service = new KubernetesNodePortService(this, "Service", new KubernetesNodePortServiceConfig
            {
                Port = config.Port,
                App = config.App,
                Component = config.Component,
                Environment = config.Environment
            });

            new TerraformOutput(this, "url", new TerraformOutputConfig
            {
                Value = $"http://localhost:{config.Port}"
            });
        }
    }
}