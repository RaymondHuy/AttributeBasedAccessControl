using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC
{
    public class CollectionRequestInfo
    {
        public string Name { get; set; }

        public FilterDefinition<BsonDocument> FilterCondition { get; set; }
    }
}
