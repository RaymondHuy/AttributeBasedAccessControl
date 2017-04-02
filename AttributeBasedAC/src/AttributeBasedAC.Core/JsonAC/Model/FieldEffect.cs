using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class FieldEffect
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("effect_function")]
        public string FunctionApply { get; set; }
    }

    public class FieldEffectEqualityComparer : IEqualityComparer<FieldEffect>
    {
        public bool Equals(FieldEffect x, FieldEffect y)
        {
            return x.Name.Equals(y.Name);
        }

        public int GetHashCode(FieldEffect obj)
        {
            return obj.GetHashCode();
        }
    }
}
