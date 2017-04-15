using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class PriorityFunction
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("priority")]
        public int Priority { get; set; }
    }
}
