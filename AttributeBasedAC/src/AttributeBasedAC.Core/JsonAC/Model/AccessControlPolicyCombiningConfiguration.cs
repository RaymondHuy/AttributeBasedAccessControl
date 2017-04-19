using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    public class AccessControlPolicyCombiningConfiguration
    {
        public ObjectId Id { get; set; }

        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("action")]
        public string Action { get; set; }

        [BsonElement("algorithm")]
        public string Algorithm { get; set; }
    }
}
