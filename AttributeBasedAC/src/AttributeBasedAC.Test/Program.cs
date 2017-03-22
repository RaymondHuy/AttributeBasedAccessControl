using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using AttributeBasedAC.Core.JsonAC.Model;
using Autofac;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.Core.JsonAC;
using System.Reflection;

namespace AttributeBasedAC.Test
{
    public class Program
    {

        static CollectionRequestInfo sub = new CollectionRequestInfo()
        {
            Name = "User",
            FilterCondition = Builders<BsonDocument>.Filter.Eq("access_token", "5f229d5b-a6c5-4c72-a151-34e121690e19")
        };

        static CollectionRequestInfo resource = new CollectionRequestInfo()
        {
            Name = "Department",
            FilterCondition = Builders<BsonDocument>.Filter.Gt("dept_id", 5)
        };

        static JObject environment = new JObject(new JProperty("a", "a"));

        static string action = "read";

        public static void Main(string[] args)
        {
            //test();
            var builder = new ContainerBuilder();

            builder.RegisterType<MongoClient>().As<IMongoClient>();

            builder.RegisterType<EnvironmentRepository>().As<IEnvironmentRepository>();
            builder.RegisterType<SubjectRepository>().As<ISubjectRepository>();
            builder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            builder.RegisterType<AccessControlPolicyRepository>().As<IAccessControlPolicyRepository>();

            builder.RegisterType<ExpressionService>().As<IExpressionService>();
            builder.RegisterType<AccessControlService>().As<IAccessControlService>();

            var container = builder.Build();

            using (var scope = container.BeginLifetimeScope())
            {
                var service = scope.Resolve<IAccessControlService>();
                RequestContext req = new RequestContext(sub, resource, action, environment);
                service.GetDataForSubject(req);
            }
        }
        public static void test()
        {
            string json = @"{
  'Name': 'Bad Boys',
  'ReleaseDate': '1995-4-7T00:00:00',
  'Genres': [
    'Action',
    'Comedy'
  ]
}";
            JObject a = JObject.Parse(json);
            Console.WriteLine(a.SelectToken("Name"));
            Console.WriteLine(a.SelectToken("aaa") == null ? "null" : "a");
        }
    }
}
