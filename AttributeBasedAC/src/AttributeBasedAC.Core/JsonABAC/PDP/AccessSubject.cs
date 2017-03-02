using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    public class AccessSubject
    {
        [BsonElement("attribute_id")]
        public string AttributeID { get; set; }

        [BsonElement("attribute_value")]
        public string AttributeValue { get; set; }

        [BsonElement("function")]
        public string Function { get; set; }
    }
}
