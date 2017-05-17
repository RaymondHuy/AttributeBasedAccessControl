using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using MongoDB.Bson.IO;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class ResourceMongoDbRepository : IResourceRepository
    {
        private readonly IMongoClient _mongoClient;

        public ResourceMongoDbRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        JObject[] IResourceRepository.GetCollectionDataWithCustomFilter(string collectionName, dynamic filter)
        {
            var data = filter == null ?
                _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(collectionName)
                                   .Find(_ => true)
                                   .ToList()

               : _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(collectionName)
                                   .Find((FilterDefinition<BsonDocument>)filter)
                                   .ToList();
            var jsonSetting = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return Newtonsoft.Json.JsonConvert.DeserializeObject<JObject[]>(data.ToJson(jsonSetting));
        }
    }
}
