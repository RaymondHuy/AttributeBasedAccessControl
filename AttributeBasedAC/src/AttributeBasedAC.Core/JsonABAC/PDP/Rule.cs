using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    [BsonIgnoreExtraElements]
    public class Rule
    {
        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("effect")]
        public string Effect { get; set; }

        [BsonElement("condtion")]
        [BsonIgnoreIfNull]
        public Expression Condition { get; set; }
        
    }
}
