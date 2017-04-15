using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class SubjectRepository : ISubjectRepository
    {
        private readonly IMongoClient _mongoClient;

        public SubjectRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        JArray ISubjectRepository.GetAllUsers(string collectionName)
        {
            var user = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                    .GetCollection<BsonDocument>(collectionName)
                                    .Find(_ => true)
                                    .ToList();

            return JArray.Parse(user.ToJson());
        }

        JObject ISubjectRepository.GetUniqueUser(string collectionName, FilterDefinition<BsonDocument> filterByKey)
        {
            var user = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                    .GetCollection<BsonDocument>(collectionName)
                                    .Find(filterByKey)
                                    .FirstOrDefault();

            return JObject.Parse(user.ToJson());
        }
    }
}
