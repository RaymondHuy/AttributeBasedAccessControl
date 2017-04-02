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

        static CollectionRequestInfo sub = new CollectionRequestInfo()
        {
            Name = "User",
            FilterCondition = Builders<BsonDocument>.Filter.Eq("access_token", "5f229d5b-a6c5-4c72-a151-34e121690e19")
        };

        static CollectionRequestInfo res = new CollectionRequestInfo()
        {
            Name = "Department",
            FilterCondition = Builders<BsonDocument>.Filter.Gt("dept_id", 5)
        };

        static JObject environment = new JObject(new JProperty("purpose", "analysis"));

        static string action = "read";

        public static void Main(string[] args)
        {
            test();
            //var builder = new ContainerBuilder();

            //builder.RegisterType<MongoClient>().As<IMongoClient>();

            //builder.RegisterType<EnvironmentRepository>().As<IEnvironmentRepository>();
            //builder.RegisterType<SubjectRepository>().As<ISubjectRepository>();
            //builder.RegisterType<ResourceRepository>().As<IResourceRepository>();
            //builder.RegisterType<AccessControlPolicyRepository>().As<IAccessControlPolicyRepository>();

            //builder.RegisterType<ExpressionService>().As<IExpressionService>();
            //builder.RegisterType<AccessControlPrivacyService>().As<IAccessControlPrivacyService>();

            //var container = builder.Build();

            //using (var scope = container.BeginLifetimeScope())
            //{
            //    var service = scope.Resolve<IAccessControlPrivacyService>();
            //    var subjectRepository = scope.Resolve<ISubjectRepository>();
            //    var resourceRepository = scope.Resolve<IResourceRepository>();
            //    var user = subjectRepository.GetUniqueUser(sub.Name, sub.FilterCondition);
            //    var resource = resourceRepository.GetCollectionDataWithCustomFilter(res.Name, res.FilterCondition);
            //    Stopwatch s = new Stopwatch();
            //    s.Start();
            //    ICollection<JObject> result = service.ExecuteSecurityProcess(user, resource, action, res.Name, environment);
            //    s.Stop();
            //    Console.WriteLine(s.Elapsed);
            //    foreach (var item in result)
            //    {
            //        Console.WriteLine(item);
            //    }
            //}
        }
        public static void test()
        {
            string json = @"{
  'Name': 'Bad Boys',
  'ReleaseDate': '1995-4-7T00:00:00',
  'Genres': [
    {'test2': {'c': 'd'}, 'array': [{'arr1': {'a1': 'b1'}}, {'arr2': {'a2': 'b2'}}]}
  ],
  'test': {'A': 'B'}
}";
            JObject a = JObject.Parse(json);
            JObject aPrivacy = new JObject();
            JToken j = a.SelectToken("Genres");
            Console.WriteLine(a.SelectToken("Genres") is JArray);
            JArray array = (JArray)a.SelectToken("Genres");
            var listToken = array.Children();
            foreach (var token in listToken)
            {
                JObject element = (JObject)token;
                Console.WriteLine(element);
            }
            a["item"] = new JArray();
            JArray item = (JArray)a["item"];
            item.Add(new JObject(new JProperty("a", "k")));
            item.Add(new JObject(new JProperty("a", "k")));
            item.Add("Item 2");
            Console.WriteLine(a);
            //string original = "{\"d\":{\"results\":[{\"__metadata\":{},\"remove\":\"done\",\"prop1\":\"value1\",\"prop2\":\"value2\",\"__some\":\"value\"},{\"__metadata\":{},\"prop3\":\"value1\",\"prop4\":\"value2\",\"__some\":\"value\"}],\"__metadata\":{\"prop3\":\"value1\",\"prop4\":\"value2\"}}}";
            //string actual = JToken.Parse(original).RemoveFields(new string[] { "results" }).ToString(Formatting.None);
            //foreach (var token in a.Properties())
            //{
            //    Console.WriteLine(token);
            //    foreach (var t in token.Children())
            //    {
            //        Console.WriteLine(t);
            //    }
            //}
        }
        public static void test2()
        {
            JObject c = new JObject();
            if (c["demo"] == null)
                c["demo"] = new JObject();
            JObject temp = (JObject)c["demo"];
            temp["d[0]"] = "a";
            temp["d[1]"] = "b";
            temp["a"] = "2";
            Console.WriteLine(c);
        }
    }
}
