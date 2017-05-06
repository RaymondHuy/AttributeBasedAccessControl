﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Model
{
    [BsonIgnoreExtraElements]
    public class PrivacyDomain
    {
        public ObjectId Id { get; set; }

        [BsonElement("domain_name")]
        public string DomainName { get; set; }

        [BsonElement("is_sub_policy")]
        public bool IsArrayFieldDomain { get; set; }

        [BsonElement("fields")]
        public ICollection<string> Fields { get; set; }

        [BsonElement("hierarchy")]
        public ICollection<PriorityFunction> Functions { get; set; }
    }
}
