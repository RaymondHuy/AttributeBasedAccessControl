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
using AttributeBasedAC.Core.NewtonsoftExtension;
using System.Reflection;
using System.Diagnostics;

namespace AttributeBasedAC.Test
{
    public static class JObjectExtension
    {
        public static JToken RemoveFields(this JToken token, string[] fields)
        {
            JContainer container = token as JContainer;
            if (container == null) return token;

            List<JToken> removeList = new List<JToken>();
            foreach (JToken el in container.Children())
            {
                JProperty p = el as JProperty;
                if (p != null && fields.Contains(p.Name))
                {
                    removeList.Add(el);
                }
                el.RemoveFields(fields);
            }

            foreach (JToken el in removeList)
            {
                el.Remove();
            }

            return token;
        }
    }
    public class Program
    {

        static CollectionRequestInfo subjest = new CollectionRequestInfo()
        {
            Name = "User",
            FilterCondition = Builders<BsonDocument>.Filter.Eq("access_token", "5f229d5b-a6c5-4c72-a151-34e121690e19")
        };

        static CollectionRequestInfo resourceInfo = new CollectionRequestInfo()
        {
            Name = "Department",
            FilterCondition = Builders<BsonDocument>.Filter.Gt("dept_id", 25)
        };

        static JObject environment = new JObject(new JProperty("purpose", "analysis"));

        static string action = "read";

        public static void Main(string[] args)
        {
            var builder = new ContainerBuilder();

            builder.RegisterType<MongoClient>().As<IMongoClient>();
            
            builder.RegisterType<SubjectRepository>().As<ISubjectRepository>();
            builder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            builder.RegisterType<AccessControlPolicyRepository>().As<IAccessControlPolicyRepository>();
            builder.RegisterType<PrivacyFunctionRepository>().As<IPrivacyFunctionRepository>();

            builder.RegisterType<ExpressionService>().As<IExpressionService>();
            builder.RegisterType<AccessControlPrivacyService>().As<IAccessControlPrivacyService>();

            var container = builder.Build();

            using (var scope = container.BeginLifetimeScope())
            {
                var service = scope.Resolve<IAccessControlPrivacyService>();
                var subjectRepository = scope.Resolve<ISubjectRepository>();
                var resourceRepository = scope.Resolve<IResourceRepository>();
                var user = subjectRepository.GetUniqueUser(subjest.Name, subjest.FilterCondition);
                var resource = resourceRepository.GetCollectionDataWithCustomFilter(resourceInfo.Name, resourceInfo.FilterCondition);
                var s = new Stopwatch();
                s.Start();
                ICollection<JObject> result = service.ExecuteSecurityProcess(user, resource, action, resourceInfo.Name, environment);
                s.Stop();
                Console.WriteLine(s.Elapsed);
                foreach (var item in result)
                {
                    Console.WriteLine(item);
                }
            }
        }
    }
}
