using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class PolicyAccessControl
    {
        public ObjectId Id { get; set; }

        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("action_subject")]
        public string ActionSubject { get; set; }

        [BsonElement("record_effect")]
        private string _recordEffect { get; set; }

        public ActionEffect RecordEffect
        {
            get
            {
                if (_recordEffect == "Permit")
                    return ActionEffect.Permit;
                else if (_recordEffect == "Deny")
                    return ActionEffect.Deny;
                else throw new Exception();
            }
            set
            {
                if (value == ActionEffect.Permit)
                    _recordEffect = "Permit";
                else if (value == ActionEffect.Permit)
                    _recordEffect = "Deny";

                RecordEffect = value;
            }
        }

        [BsonElement("record_rules")]
        public Function RecordRules { get; set; }

        [BsonElement("collection_field_rules")]
        public ICollection<FieldCondition> CollectionFieldRules { get; set; }

        [BsonElement("record_field_rules")]
        public ICollection<FieldCondition> RecordFieldRules { get; set; }
    }
}
