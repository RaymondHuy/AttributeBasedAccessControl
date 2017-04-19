using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class PrivacyPolicyRepository : IPrivacyPolicyRepository
    {
        private IMongoClient _mongoClient;
        public PrivacyPolicyRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }
        ICollection<PrivacyPolicy> IPrivacyPolicyRepository.GetPolicies(string collectionName, string action, bool isAttributeResourceRequired)
        {
            var builder = Builders<PrivacyPolicy>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action", action)
                       & builder.Eq("is_attribute_resource_required", isAttributeResourceRequired);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .Find(filter)
                                   .ToList();
            return data;
        }
    }
}
