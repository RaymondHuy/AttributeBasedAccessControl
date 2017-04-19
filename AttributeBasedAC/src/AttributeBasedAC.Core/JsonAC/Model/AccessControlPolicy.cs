using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class AccessControlPolicy
    {
        public ObjectId Id { get; set; }

        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("rule_combining")]
        public string RuleCombining { get; set; }

        [BsonElement("effect")]
        public string Effect { get; set; }

        [BsonElement("action")]
        public string Action { get; set; }

        [BsonElement("rules")]
        public ICollection<AccessControlRule> Rules { get; set; }
    }
}
