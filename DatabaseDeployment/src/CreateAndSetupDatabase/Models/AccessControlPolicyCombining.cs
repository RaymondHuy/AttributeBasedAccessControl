using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    public class AccessControlPolicyCombining
    {
        
        [BsonElement("policies_id")]
        public ICollection<string> PolicyIds { get; set; }

        [BsonElement("algorithm")]
        public string Algorithm { get; set; }
    }
}
