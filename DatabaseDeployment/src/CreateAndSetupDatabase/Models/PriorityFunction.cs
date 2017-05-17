using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
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
