using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonABAC;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace AttributeBasedAC.Test
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Policy p = new Policy();
            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase("myfirstdb");

            var json = _database.GetCollection<BsonDocument>("XACML").Find(_=>true).ToList().ToJson();

            JObject j = JObject.Parse(json);

            var _collection = _database.GetCollection<PolicySet>("XACML").Find(_ => true).ToList();
            foreach (var policy in _collection)
            {
                Console.WriteLine(policy);
            }
        }
    }
}
