using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;

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

        ICollection<PrivacyPolicy> IPrivacyPolicyRepository.GetAll()
        {
            return _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<PrivacyPolicy>(JsonAccessControlSetting.PrivacyCollectionName)
                                   .Find(_ => true)
                                   .ToList();
        }

        ICollection<PrivacyPolicy> IPrivacyPolicyRepository.GetPolicies(string collectionName, string action, bool? isAttributeResourceRequired)
        {
            var builder = Builders<PrivacyPolicy>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action", action);

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
    }
}
