using System;
using System.Collections.Generic;
using Constructs;
using HashiCorp.Cdktf;

namespace MyCompany.MyApp
{
    class Program
    {
        public static void Main(string[] args)
        {
            App app = new App();
            new MainStack(app, "app-development", new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-frontend:latest",
                Replicas = 3,
                Port = 30001,
                App = "myapp",
                Component = "frontend",
                Environment = "dev",
                Env = new Dictionary<string, string> { }
            }, new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-backend:latest",
                Replicas = 1,
                Port = 30002,
                App = "myapp",
                Component = "backend",
                Environment = "dev",
                Env = new Dictionary<string, string> { }
            });

            new MainStack(app, "app-test", new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-frontend:latest",
                Replicas = 3,
                Port = 30003,
                App = "myapp",
                Component = "frontend",
                Environment = "test",
                Env = new Dictionary<string, string> { }
            }, new SimpleKubernetesWebAppConfig
            {
                Image = "localhost:5000/nocorp-backend:latest",
                Replicas = 1,
                Port = 30004,
                App = "myapp",
                Component = "backend",
                Environment = "test",
                Env = new Dictionary<string, string> { }
            });
            app.Synth();
            Console.WriteLine("App synth complete");
        }
    }
}