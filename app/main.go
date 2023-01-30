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

type MyStackConfig struct {
	Frontend *myconstructs.SimpleKubernetesWebAppConfig
	Backend  *myconstructs.SimpleKubernetesWebAppConfig
}

func NewMyStack(scope constructs.Construct, id string, config MyStackConfig) cdktf.TerraformStack {
	stack := cdktf.NewTerraformStack(scope, &id)

	cwd, _ := os.Getwd()

	kubernetesprovider.NewKubernetesProvider(stack, jsii.String("kind"), &kubernetesprovider.KubernetesProviderConfig{
		ConfigPath: jsii.String(path.Join(cwd, "../kubeconfig.yaml")),
	})

	backend := myconstructs.NewSimpleKubernetesWebApp(stack, jsii.String("app_backend"), config.Backend)

	config.Frontend.Env = &map[string]*string{"BACKEND_APP_URL": jsii.String(fmt.Sprintf("http://localhost:%d", backend.Config.Port))}
	myconstructs.NewSimpleKubernetesWebApp(stack, jsii.String("app_frontend"), config.Frontend)

	return stack
}

func main() {
	app := cdktf.NewApp(nil)

	NewMyStack(app, "app", MyStackConfig{
		Backend: &myconstructs.SimpleKubernetesWebAppConfig{
			Image:       jsii.String("localhost:5000/nocorp-backend:latest"),
			Replicas:    1,
			Port:        30002,
			App:         jsii.String("myapp"),
			Component:   jsii.String("backend"),
			Environment: jsii.String("dev"),
		},
		Frontend: &myconstructs.SimpleKubernetesWebAppConfig{
			Image:       jsii.String("localhost:5000/nocorp-frontend:latest"),
			Replicas:    3,
			App:         jsii.String("myapp"),
			Component:   jsii.String("frontend"),
			Environment: jsii.String("dev"),
			Port:        30001,
		},
	})

	app.Synth()
}
