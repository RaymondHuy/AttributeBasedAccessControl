using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public interface IResourceRepository
    {
        JObject[] GetCollectionDataWithCustomFilter(string collectionName, FilterDefinition<BsonDocument> filter);
    }
}
