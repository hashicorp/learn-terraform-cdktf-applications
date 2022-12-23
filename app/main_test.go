package main

import (
	"testing"

	"cdk.tf/go/stack/myconstructs"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/deployment"
	kubernetesprovider "github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/provider"

	"github.com/hashicorp/terraform-cdk-go/cdktf"
)

// The tests below are example tests, you can find more information at
// https://cdk.tf/testing

func NewTestStack(scope constructs.Construct, id string) cdktf.TerraformStack {
	stack := cdktf.NewTerraformStack(scope, &id)

	kubernetesprovider.NewKubernetesProvider(stack, jsii.String("kubernetes"), nil)

	myconstructs.NewKubernetesWebAppDeployment(stack, jsii.String("webapp"), &myconstructs.KubernetesWebAppDeploymentConfig{
		Image:       jsii.String("nginx:latest"),
		Replicas:    4,
		App:         jsii.String("myapp"),
		Component:   jsii.String("frontend"),
		Environment: jsii.String("dev"),
	})

	return stack
}

var run_validations = true
var synth = cdktf.Testing_Synth(
	NewTestStack(cdktf.Testing_App(nil), *jsii.String("testing")),
	&run_validations,
)

func TestShouldContainContainer(t *testing.T) {
	assertion := cdktf.Testing_ToHaveResource(synth, deployment.Deployment_TfResourceType())

	if !*assertion {
		t.Error("Expected kubernetes Deployment construct but found none")
	}
}
