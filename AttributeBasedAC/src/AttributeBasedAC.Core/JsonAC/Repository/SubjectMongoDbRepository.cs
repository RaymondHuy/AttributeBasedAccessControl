using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using MongoDB.Bson.IO;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class SubjectMongoDbRepository : ISubjectRepository
    {
        private readonly IMongoClient _mongoClient;

        public SubjectMongoDbRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        JArray ISubjectRepository.GetAllUsers(string collectionName)
        {
            var user = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                    .GetCollection<BsonDocument>(collectionName)
                                    .Find(_ => true)
                                    .ToList();
            var jsonSetting = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return JArray.Parse(user.ToJson(jsonSetting));
        }

        JObject ISubjectRepository.GetUniqueUser(string collectionName, dynamic filterExpressionByKey)
        {
            var filter = (FilterDefinition<BsonDocument>)filterExpressionByKey;
            var user = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                    .GetCollection<BsonDocument>(collectionName)
                                    .Find(filter)
                                    .FirstOrDefault();
            var jsonSetting = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return JObject.Parse(user.ToJson(jsonSetting));
        }
    }
}
