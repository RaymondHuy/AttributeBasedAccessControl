using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class Function
    {
        [BsonElement("function_name")]
        [BsonIgnoreIfNull]
        public string FunctionName { get; set; }

        [BsonElement("parameters")]
        [BsonIgnoreIfNull]
        public ICollection<Function> Parameters { get; set; }

        [BsonElement("value")]
        [BsonIgnoreIfNull]
        public string Value { get; set; }

        [BsonElement("resource_id")]
        [BsonIgnoreIfNull]
        public string ResourceID { get; set; }
    }
}
