using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class FieldCondition
    {
        [BsonElement("field_effects")]
        public ICollection<FieldEffect> FieldEffects { get; set; }
        
        [BsonElement("rules")]
        public Function Rules { get; set; }
    }
}
