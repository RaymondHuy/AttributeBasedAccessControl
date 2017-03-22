using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class ResourceRepository : IResourceRepository
    {
        private readonly IMongoClient _mongoClient;

        public ResourceRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        JObject[] IResourceRepository.GetCollectionDataWithCustomFilter(string collectionName, FilterDefinition<BsonDocument> filter)
        {
            var data = filter == null ?
                _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(collectionName)
                                   .Find(_ => true)
                                   .ToList()

               : _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(collectionName)
                                   .Find(filter)
                                   .ToList();

            return JsonConvert.DeserializeObject<JObject[]>(data.ToJson());
        }
    }
}
