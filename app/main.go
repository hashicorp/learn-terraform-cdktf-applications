package main

import (
	"fmt"
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

	backend := myconstructs.NewSimpleKubernetesWebApp(stack, jsii.String("app_backend"), &myconstructs.SimpleKubernetesWebAppConfig{
		Image:       jsii.String("localhost:5000/nocorp-backend:latest"),
		Replicas:    1,
		Port:        30002,
		App:         jsii.String("myapp"),
		Component:   jsii.String("backend"),
		Environment: jsii.String("dev"),
	})

	myconstructs.NewSimpleKubernetesWebApp(stack, jsii.String("app_frontend"), &myconstructs.SimpleKubernetesWebAppConfig{
		Image:       jsii.String("localhost:5000/nocorp-frontend:latest"),
		Replicas:    3,
		App:         jsii.String("myapp"),
		Component:   jsii.String("frontend"),
		Environment: jsii.String("dev"),
		Port:        30001,
		Env:         &map[string]*string{"BACKEND_APP_URL": jsii.String(fmt.Sprintf("http://localhost:%d", backend.Config.Port))},
	})

	return stack
}

func main() {
	app := cdktf.NewApp(nil)

	NewMyStack(app, "app")

	app.Synth()
}
