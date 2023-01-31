using System;
using System.IO;
using System.Collections.Generic;
using Constructs;
using HashiCorp.Cdktf;
using HashiCorp.Cdktf.Providers.Kubernetes.Deployment;


namespace MyCompany.MyApp
{

    class KubernetesWebAppDeploymentConfig
    {
        public string Image { get; set; }
        public int Replicas { get; set; }
        public string App { get; set; }
        public string Component { get; set; }
        public string Environment { get; set; }
        public Dictionary<string, string> Env { get; set; }
    }

    class KubernetesWebAppDeployment : Construct
    {
        public KubernetesWebAppDeployment(Construct scope, string id, KubernetesWebAppDeploymentConfig config) : base(scope, id)
        {

            List<DeploymentSpecTemplateSpecContainerEnv> env = new List<DeploymentSpecTemplateSpecContainerEnv>();
            foreach (KeyValuePair<string, string> entry in config.Env)
            {
                env.Add(new DeploymentSpecTemplateSpecContainerEnv
                {
                    Name = entry.Key,
                    Value = entry.Value
                });
            }

            new Deployment(this, id, new DeploymentConfig
            {
                Metadata = new DeploymentMetadata
                {
                    Name = $"{config.App}-{config.Component}-{config.Environment}",
                    Labels = new Dictionary<string, string> {
                        { "app", config.App },
                        { "component", config.Component },
                        { "environment", config.Environment }
                    }
                },
                Spec = new DeploymentSpec
                {
                    Replicas = config.Replicas.ToString(),
                    Selector = new DeploymentSpecSelector
                    {
                        MatchLabels = new Dictionary<string, string> {
                            { "app", config.App },
                            { "component", config.Component },
                            { "environment", config.Environment }
                        }
                    },
                    Template = new DeploymentSpecTemplate
                    {
                        Metadata = new DeploymentSpecTemplateMetadata
                        {
                            Labels = new Dictionary<string, string> {
                                { "app", config.App },
                                { "component", config.Component },
                                { "environment", config.Environment }
                            }
                        },
                        Spec = new DeploymentSpecTemplateSpec
                        {
                            Container = new DeploymentSpecTemplateSpecContainer[] {
                                new DeploymentSpecTemplateSpecContainer {
                                    Name = $"{config.App}-{config.Component}-{config.Environment}",
                                    Image = config.Image,
                                    Env = env.ToArray()
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}