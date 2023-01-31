using System;
using System.IO;
using System.Collections.Generic;
using Constructs;
using HashiCorp.Cdktf;
using HashiCorp.Cdktf.Providers.Kubernetes.Service;


namespace MyCompany.MyApp
{

    class KubernetesNodePortServiceConfig
    {
        public int Port { get; set; }
        public string App { get; set; }
        public string Component { get; set; }
        public string Environment { get; set; }
    }

    class KubernetesNodePortService : Construct
    {
        public Service Resource { get; set; }

        public KubernetesNodePortService(Construct scope, string id, KubernetesNodePortServiceConfig config) : base(scope, id)
        {

            this.Resource = new Service(this, id, new ServiceConfig
            {
                Metadata = new ServiceMetadata
                {
                    Name = $"{config.App}-{config.Component}-{config.Environment}",
                },
                Spec = new ServiceSpec
                {
                    Type = "NodePort",
                    Selector = new Dictionary<string, string> {
                        { "app", config.App },
                        { "component", config.Component },
                        { "environment", config.Environment }
                    },
                    Port = new ServiceSpecPort[]
                    {
                        new ServiceSpecPort
                        {
                            Port = 80,
                            TargetPort = "80",
                            NodePort = config.Port,
                            Protocol = "TCP"
                        }
                    }
                }
            });
        }
    }
}