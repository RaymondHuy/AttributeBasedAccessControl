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
using AttributeBasedAC.Test.WebApiTesting;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.UserDefinedFunction;

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
            UserDefinedFunctionPluginFactory.GetInstance().RegisterDefaultPlugin();
            IConditionalExpressionService exp = new ConditionalExpressionService();
            exp.Parse("IntegerGreaterThan ( 20 , 30 ) ");
            return;
            var builder = new ContainerBuilder();
            builder.RegisterType<MongoClient>().As<IMongoClient>();
            
            builder.RegisterType<SubjectMongoDbRepository>().As<ISubjectRepository>();
            builder.RegisterType<ResourceMongoDbRepository>().As<IResourceRepository>();
            builder.RegisterType<AccessControlPolicyMongoDbRepository>().As<IAccessControlPolicyRepository>();
            builder.RegisterType<PrivacyDomainMongoDbRepository>().As<IPrivacyDomainRepository>();
            builder.RegisterType<PrivacyPolicyMongoDbRepository>().As<IPrivacyPolicyRepository>();

            builder.RegisterType<ConditionalExpressionService>().As<IConditionalExpressionService>();
            builder.RegisterType<AccessControlPrivacyService>().As<IAccessControlPrivacyService>();

            var container = builder.Build();

            using (var scope = container.BeginLifetimeScope())
            {
                Test(scope);
                //var service = scope.Resolve<IAccessControlPrivacyService>();
                //var subjectRepository = scope.Resolve<ISubjectRepository>();
                //var resourceRepository = scope.Resolve<IResourceRepository>();
                //var user = subjectRepository.GetUniqueUser(subjest.Name, subjest.FilterCondition);
                //var resource = resourceRepository.GetCollectionDataWithCustomFilter(resourceInfo.Name, null);
                //var s = new Stopwatch();
                //s.Start();
                //ICollection<JObject> result = service.ExecuteSecurityProcess(user, resource, action, resourceInfo.Name, environment);
                //s.Stop();
                //Console.WriteLine(s.Elapsed);
                //foreach (var item in result)
                //{
                //    Console.WriteLine(item);
                //}
            }
        }
        public static void TestMongoDbFilter()
        {
            var _mongoClient = new MongoClient();

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.AnyIn("algorithm", "permit");

            var _mongoCollection = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                        .GetCollection<BsonDocument>("AccessControlPolicyCombiningConfiguration2")
                                        .Find(filter)
                                        .ToList();
        }
        public static void Test(ILifetimeScope scope)
        {
            //test.PolandNotationProcess(s);
            //Function f = service.Parse(s);
            var test = new PrivacyControllerTest();
            test.PolicyReview(scope);
        }
    }
}
