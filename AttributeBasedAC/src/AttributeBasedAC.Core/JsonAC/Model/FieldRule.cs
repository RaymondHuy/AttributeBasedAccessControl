using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class FieldRule
    {
        [BsonElement("field_effects")]
        public ICollection<FieldEffect> FieldEffects { get; set; }
        
        [BsonElement("condition")]
        public Function Condition { get; set; }

        [BsonElement("rule_id")]
        public Function Id { get; set; }
    }
}
