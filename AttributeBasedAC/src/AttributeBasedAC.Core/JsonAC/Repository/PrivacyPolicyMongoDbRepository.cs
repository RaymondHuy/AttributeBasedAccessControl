using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using Newtonsoft.Json.Linq;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class PrivacyPolicyMongoDbRepository : IPrivacyPolicyRepository
    {
        private IMongoClient _mongoClient;
        public PrivacyPolicyMongoDbRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        void IPrivacyPolicyRepository.Add(PrivacyPolicy privacyPolicy)
        {
            var MongoDB = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName);
            var Collec = MongoDB.GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName);

            Collec.InsertOneAsync(privacyPolicy);
        }

        void IPrivacyPolicyRepository.Delete(string policyID)
        {
            var builder = Builders<PrivacyPolicy>.Filter;
            var filter = builder.Eq("policy_id", policyID);
            _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .DeleteOne(filter);
        }

        ICollection<PrivacyPolicy> IPrivacyPolicyRepository.GetAll()
        {
            return _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .Find(_ => true)
                                   .ToList();
        }

        ICollection<PrivacyPolicy> IPrivacyPolicyRepository.GetPolicies(string collectionName, bool? isAttributeResourceRequired)
        {
            var builder = Builders<PrivacyPolicy>.Filter;
            var filter = builder.Eq("collection_name", collectionName);

            if (isAttributeResourceRequired != null)
                filter = filter & builder.Eq("is_attribute_resource_required", isAttributeResourceRequired);


            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .Find(filter)
                                   .ToList();
            return data;
        }

        PrivacyPolicy IPrivacyPolicyRepository.GetPolicy(string policyID)
        {
            var builder = Builders<PrivacyPolicy>.Filter;
            var filter = builder.Eq("policy_id", policyID);

            return _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .Find(filter)
                                   .First();
        }

        ICollection<string> IPrivacyPolicyRepository.GetArrayFieldName()
        {
            var client = new MongoClient();
            MongoServer server = client.GetServer();
            MongoDatabase database = server.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName);
            var collectionNames = database.GetCollectionNames();
            var result = new List<string>();
            foreach (var name in collectionNames)
            {
               var data = _mongoClient.GetDatabase(JsonAccessControlSetting.UserDefaultDatabaseName)
                            .GetCollection<BsonDocument>(name)
                            .Find(_ => true)
                            .First();
                var jsonSetting = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
                var json = JObject.Parse(data.ToJson(jsonSetting));
                RecursiveProcessArrayField(json, name, ref result);
            }
            return result;
        }

        private void RecursiveProcessArrayField(JObject data, string name, ref List<string> result)
        {
            foreach (var token in data)
            {
                if (token.Value is JArray)
                {
                    if (token.Value.First() is JObject)
                    {
                        var path = name + "." + token.Key;
                        result.Add(path);
                        RecursiveProcessArrayField(JObject.Parse(token.Value.First().ToString()), path, ref result);
                    }
                }
            }
        }
    }
}
