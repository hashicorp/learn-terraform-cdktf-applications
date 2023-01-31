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
            new KubernetesProvider(this, "k8s", new KubernetesProviderConfig {
                ConfigPath = Path.Join(Environment.CurrentDirectory, "../kubeconfig.yaml"),
            });

            new Deployment(this, "myApp", new DeploymentConfig {
                Metadata = new DeploymentMetadata {
                    Name = "my-app",
                    Labels = new Dictionary<string, string> {
                        { "app", "my-app" },
                        { "component", "frontend" },
                        { "environment", "dev" }
                    }
                },
                Spec = new DeploymentSpec {
                    Replicas = "4",
                    Selector = new DeploymentSpecSelector {
                        MatchLabels = new Dictionary<string, string> {
                            { "app", "my-app" },
                            { "component", "frontend" },
                            { "environment", "dev" }
                        }
                    },
                    Template = new DeploymentSpecTemplate {
                        Metadata = new DeploymentSpecTemplateMetadata {
                            Labels = new Dictionary<string, string> {
                                { "app", "my-app" },
                                { "component", "frontend" },
                                { "environment", "dev" }
                            }
                        },
                        Spec = new DeploymentSpecTemplateSpec {
                            Container = new DeploymentSpecTemplateSpecContainer[] {
                                new DeploymentSpecTemplateSpecContainer {
                                    Name = "frontend",
                                    Image = "nginx:latest"
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}