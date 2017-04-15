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

        [BsonElement("action")]
        public string ActionSubject { get; set; }

        [BsonElement("collection_field_rules")]
        public ICollection<FieldCondition> CollectionFieldRules { get; set; }

        [BsonElement("record_rules")]
        public ICollection<FieldCondition> RecordFieldRules { get; set; }
    }
}
