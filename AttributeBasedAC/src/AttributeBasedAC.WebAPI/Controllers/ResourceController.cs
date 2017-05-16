using AttributeBasedAC.Core.JsonAC;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.Repository;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class ResourceController : Controller
    {
        private readonly IMongoClient _mongoClient;

        public ResourceController(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        [HttpGet]
        [Route("api/structure")]
        public string GetCollectionStructure(string collectionName)
        {
            var exampleStructure = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(collectionName)
                                   .Find(_ => true)
                                   .First();

            return exampleStructure.ToJson();
        }

        [HttpGet]
        [Route("api/collections")]
        public IEnumerable<string> GetAllCollections()
        {
            var client = new MongoClient();
            MongoServer server = client.GetServer();
            MongoDatabase database = server.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName);
            return database.GetCollectionNames();
        }

        [HttpGet]
        [Route("api/subject/fields")]
        public string GetSubjectFields()
        {
            var exampleStructure = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                                   .GetCollection<BsonDocument>(JsonAccessControlSetting.UserDefaultCollectionName)
                                   .Find(_ => true)
                                   .First();

            return exampleStructure.ToJson();
        }
    }
}
