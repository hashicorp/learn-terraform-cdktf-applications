using Xunit;
using HashiCorp.Cdktf;
using System;
using System.IO;
using System.Collections.Generic;
using HashiCorp.Cdktf.Providers.Kubernetes.Provider;
using HashiCorp.Cdktf.Providers.Kubernetes.Service;
namespace MyCompany.MyApp
{
    // The tests below are example tests, you can find more information at
    // https://cdk.tf/testing
    public class TestProgram
    {
        [Fact]
        public void kuberentesNodePortServiceShouldContainService()
        {
            TerraformStack stack = new TerraformStack(Testing.App(), "stack");
            new KubernetesProvider(stack, "k8s", new KubernetesProviderConfig
            {
                ConfigPath = Path.Join(Environment.CurrentDirectory, "../kubeconfig.yaml"),
            });

            new KubernetesNodePortService(stack, "service", new KubernetesNodePortServiceConfig
            {
                Port = 30001,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
            });

            string synthesized = Testing.Synth(stack);
            Assert.True(Testing.ToHaveResource(synthesized, Service.TfResourceType));
        }
    }
}
