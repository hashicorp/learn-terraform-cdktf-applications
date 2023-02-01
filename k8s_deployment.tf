# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

resource "kubernetes_deployment" "myapp" {
  metadata {
    name = "myapp-frontend-dev"
    labels = {
      app = "myapp"
      component = "frontend"
      environment = "dev"
    }
  }

  spec {
    replicas = "1"

    selector {
      match_labels = {
        app = "myapp"
        component = "frontend"
        environment = "dev"
      }
    }

    template {
      metadata {
        labels = {
          app = "myapp"
          component = "frontend"
          environment = "dev"
        }
      }

      spec {
        container {
          image = "nginx:latest"
          name  = "myapp-frontend-dev"
          # ports {
          #   containerPort = 80
          # }
        }
      }
    }
  }
}
