resource "kubernetes_deployment" "myapp" {
  metadata {
    name = "myapp"
    labels = {
      app = "myapp"
      environment = "dev"
    }
  }

  spec {
    replicas = "1"

    selector {
      match_labels = {
        environment = "dev"
        app = "myapp"
      }
    }

    template {
      metadata {
        labels = {
          environment = "dev"
          app = "myapp"
        }
      }

      spec {
        container {
          image = "nginx:latest"
          name  = "frontend"
          
          # ports {
          #   containerPort = 80
          # }

          # liveness_probe {
          #   http_get {
          #     path = "/nginx_status"
          #     port = 80
          #   }
          # }
        }
      }
    }
  }
}
