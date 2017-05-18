using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    [BsonIgnoreExtraElements]
    public class AccessControlPolicy
    {
        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("policy_id")]
        public string PolicyId { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("rule_combining")]
        public string RuleCombining { get; set; }

        [BsonElement("is_attribute_resource_required")]
        public bool IsAttributeResourceRequired { get; set; }

        [BsonElement("action")]
        public string Action { get; set; }

        [BsonElement("target")]
        public Function Target { get; set; }

        [BsonElement("rules")]
        public ICollection<AccessControlRule> Rules { get; set; }
    }
    public static class AccessControlPolicyRepository
    {
        public static void InsertDummyData(string policyDb)
        {
            var data = new List<AccessControlPolicy>();
            data.Add(new AccessControlPolicy
            {
                CollectionName = "Department",
                Action = "read",
                Description = "",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 01",
                RuleCombining = "permit-overrides",
                Target = new Function { FunctionName = "StringEqual", Parameters = new List<Function> { new Function { ResourceID = "Subject", Value = "role" }, new Function { ResourceID = null, Value = "Admin" } } },
                Rules = new List<AccessControlRule> { new AccessControlRule { Effect = "Permit", Id = "Rule 1", Condition = new Function { FunctionName = "BooleanEqual", Parameters = new List<Function> { new Function { ResourceID = "Subject", Value = "active" }, new Function { ResourceID = null, Value = "True" } } } } }
            });
            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");
            acPolicyCollection.InsertMany(data);
        }
    }
}
