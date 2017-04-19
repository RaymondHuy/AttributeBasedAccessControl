using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using Newtonsoft.Json.Linq;
using MongoDB.Driver;
using MongoDB.Bson;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class AccessControlPolicyRepository : IAccessControlPolicyRepository
    {
        private readonly IMongoClient _mongoClient;

        public AccessControlPolicyRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }
        
        ICollection<AccessControlPolicy> IAccessControlPolicyRepository.GetPolicies(string collectionName, string action, bool isAttributeResourceRequired)
        {
            var builder = Builders<AccessControlPolicy>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action", action)
                       & builder.Eq("is_attribute_resource_required", isAttributeResourceRequired);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicy>(JsonAccessControlSetting.AccessControlCollectionName)
                                   .Find(filter)
                                   .ToList();
            return data;
        }

        string IAccessControlPolicyRepository.GetPolicyCombining(string collectionName, string action)
        {
            var builder = Builders<AccessControlPolicyCombiningConfiguration>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action", action);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicyCombiningConfiguration>(JsonAccessControlSetting.AccessControlPolicyCombiningConfigurtaion)
                                   .Find(filter)
                                   .First();
            return data.Algorithm;
        }
    }
}
