using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class PrivacyPolicy
    {
        public ObjectId Id { get; set; }

        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("action")]
        public string ActionSubject { get; set; }

        [BsonElement("is_attribute_resource_required")]
        public bool IsAttributeResourceRequired { get; set; }

        [BsonElement("rules")]
        public ICollection<FieldRule> Rules { get; set; }
        
    }
}
