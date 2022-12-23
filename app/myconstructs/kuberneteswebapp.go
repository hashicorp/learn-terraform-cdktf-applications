package myconstructs

import (
	"fmt"

	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
	"github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/deployment"
	"github.com/cdktf/cdktf-provider-kubernetes-go/kubernetes/v4/service"
)

type KubernetesWebAppDeploymentConfig struct {
	Image       *string
	Replicas    int
	App         *string
	Component   *string
	Environment *string
	Env         *map[string]*string
}

func NewKubernetesWebAppDeployment(scope constructs.Construct, name *string, config *KubernetesWebAppDeploymentConfig) constructs.Construct {
	c := constructs.NewConstruct(scope, name)

	labels := &map[string]*string{
		"app":         config.App,
		"component":   config.Component,
		"environment": config.Environment,
	}

	deployment_name := fmt.Sprintf("%s-%s-%s", *config.App, *config.Component, *config.Environment)

	// convert config.Env to format used in kubernetes container spec
	env := []map[string]*string{}
	if config.Env != nil {
		for key, value := range *config.Env {
			env = append(env, map[string]*string{"name": jsii.String(key), "value": value})
		}
	}

	deployment.NewDeployment(c, name, &deployment.DeploymentConfig{
		Metadata: &deployment.DeploymentMetadata{
			Labels: labels,
			Name:   &deployment_name,
		},
		Spec: &deployment.DeploymentSpec{
			Replicas: jsii.String(fmt.Sprint(config.Replicas)),
			Selector: &deployment.DeploymentSpecSelector{
				MatchLabels: labels,
			},
			Template: &deployment.DeploymentSpecTemplate{
				Metadata: &deployment.DeploymentSpecTemplateMetadata{
					Labels: labels,
				},
				Spec: &deployment.DeploymentSpecTemplateSpec{
					Container: &[]map[string]interface{}{
						{
							"image": config.Image,
							"name":  &deployment_name,
							"env":   &env,
						},
					},
				},
			},
		},
	})

	return c
}

type KubernetesNodePortServiceConfig struct {
	Port        int
	App         *string
	Component   *string
	Environment *string
}

type KubernetesNodePortService struct {
	resource service.Service
}

func NewKubernetesNodePortService(scope constructs.Construct, name *string, config *KubernetesNodePortServiceConfig) KubernetesNodePortService {
	c := constructs.NewConstruct(scope, name)

	service := service.NewService(c, name, &service.ServiceConfig{
		Metadata: &service.ServiceMetadata{
			Name: jsii.String(fmt.Sprintf("%s-%s-%s", *config.App, *config.Component, *config.Environment)),
		},
		Spec: &service.ServiceSpec{
			Type: jsii.String("NodePort"),
			Port: &[]map[string]interface{}{
				{
					"port":       80,
					"targetPort": jsii.String("80"),
					"nodePort":   config.Port,
					"protocol":   jsii.String("TCP"),
				},
			},
		},
	})

	knps := KubernetesNodePortService{
		resource: service,
	}

	return knps
}
