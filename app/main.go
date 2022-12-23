package main

import (
	"os"
	"path"

	"cdk.tf/go/stack/myconstructs"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	kubernetesprovider "github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/provider"
	"github.com/hashicorp/terraform-cdk-go/cdktf"
)

func NewMyStack(scope constructs.Construct, id string) cdktf.TerraformStack {
	stack := cdktf.NewTerraformStack(scope, &id)

	cwd, _ := os.Getwd()

	kubernetesprovider.NewKubernetesProvider(stack, jsii.String("kind"), &kubernetesprovider.KubernetesProviderConfig{
		ConfigPath: jsii.String(path.Join(cwd, "../kubeconfig.yaml")),
	})

	myconstructs.NewKubernetesWebAppDeployment(stack, jsii.String("deployment"), &myconstructs.KubernetesWebAppDeploymentConfig{
		Image:       jsii.String("nginx:latest"),
		Replicas:    2,
		App:         jsii.String("myapp"),
		Component:   jsii.String("frontend"),
		Environment: jsii.String("dev"),
	})

	return stack
}

func main() {
	app := cdktf.NewApp(nil)

	NewMyStack(app, "app")

	app.Synth()
}
