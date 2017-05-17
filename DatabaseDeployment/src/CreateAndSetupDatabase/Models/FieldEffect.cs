using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    [BsonIgnoreExtraElements]
    public class FieldEffect
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("effect_function")]
        public string FunctionApply { get; set; }
    }
    
}
