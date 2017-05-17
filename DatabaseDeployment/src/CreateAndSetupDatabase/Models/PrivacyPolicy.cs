using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    [BsonIgnoreExtraElements]
    public class PrivacyPolicy
    {
        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("policy_id")]
        public string PolicyId { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("target")]
        public Function Target { get; set; }

        [BsonElement("action")]
        public string Action { get; set; }

        [BsonElement("is_attribute_resource_required")]
        public bool IsAttributeResourceRequired { get; set; }

        [BsonElement("rules")]
        public ICollection<FieldRule> Rules { get; set; }
        
    }
}
