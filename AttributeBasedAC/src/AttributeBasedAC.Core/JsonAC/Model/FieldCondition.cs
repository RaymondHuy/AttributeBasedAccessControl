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
        [BsonElement("field_names")]
        public ICollection<string> FieldNames { get; set; }

        [BsonElement("field_effect")]
        private string _fieldEffect { get; set; }

        public ActionEffect FieldEffect
        {
            get
            {
                if (_fieldEffect == "Permit")
                    return ActionEffect.Permit;
                else if (_fieldEffect == "Deny")
                    return ActionEffect.Deny;
                else throw new Exception();
            }
            set
            {
                if (value == ActionEffect.Permit)
                    _fieldEffect = "Permit";
                else if (value == ActionEffect.Permit)
                    _fieldEffect = "Deny";

                FieldEffect = value;
            }
        }

        [BsonElement("rules")]
        public Function Rules { get; set; }
    }
}
