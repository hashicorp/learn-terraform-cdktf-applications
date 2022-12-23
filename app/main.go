package main

import (
	"os"
	"path"

	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/deployment"
	kubernetesprovider "github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/provider"
	"github.com/hashicorp/terraform-cdk-go/cdktf"
)

func NewMyStack(scope constructs.Construct, id string) cdktf.TerraformStack {
	stack := cdktf.NewTerraformStack(scope, &id)

	cwd, _ := os.Getwd()

	kubernetesprovider.NewKubernetesProvider(stack, jsii.String("kind"), &kubernetesprovider.KubernetesProviderConfig{
		ConfigPath: jsii.String(path.Join(cwd, "../kubeconfig.yaml")),
	})

	deployment.NewDeployment(stack, jsii.String("myapp"), &deployment.DeploymentConfig{
		Metadata: &deployment.DeploymentMetadata{
			Labels: &map[string]*string{
				"app":         jsii.String("myapp"),
				"component":   jsii.String("frontend"),
				"environment": jsii.String("dev"),
			},
			Name: jsii.String("myapp"),
		},
		Spec: &deployment.DeploymentSpec{
			Replicas: jsii.String("1"),
			Selector: &deployment.DeploymentSpecSelector{
				MatchLabels: &map[string]*string{
					"app":         jsii.String("myapp"),
					"component":   jsii.String("frontend"),
					"environment": jsii.String("dev"),
				},
			},
			Template: &deployment.DeploymentSpecTemplate{
				Metadata: &deployment.DeploymentSpecTemplateMetadata{
					Labels: &map[string]*string{
						"app":         jsii.String("myapp"),
						"component":   jsii.String("frontend"),
						"environment": jsii.String("dev"),
					},
				},
				Spec: &deployment.DeploymentSpecTemplateSpec{
					Container: &[]map[string]*string{
						{
							"image": jsii.String("nginx:latest"),
							"name":  jsii.String("frontend"),
						},
					},
				},
			},
		},
	})

	return stack
}

func main() {
	app := cdktf.NewApp(nil)

	NewMyStack(app, "app")

	app.Synth()
}
