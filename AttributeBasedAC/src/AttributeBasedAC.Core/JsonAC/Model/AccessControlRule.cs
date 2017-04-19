using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class AccessControlRule
    {
        [BsonElement("id")]
        public string Id { get; set; }

        [BsonElement("effect")]
        public string Effect { get; set; }

        [BsonElement("condition")]
        public Function Condition { get; set; }
    }
}
