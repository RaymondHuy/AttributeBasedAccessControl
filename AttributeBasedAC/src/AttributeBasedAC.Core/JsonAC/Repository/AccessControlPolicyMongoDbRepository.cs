using System.Collections.Generic;
using System.Linq;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;
using AttributeBasedAC.Core.JsonAC.Infrastructure;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class AccessControlPolicyMongoDbRepository : IAccessControlPolicyRepository
    {
        private readonly IMongoClient _mongoClient;

        public AccessControlPolicyMongoDbRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
        }

        void IAccessControlPolicyRepository.Add(AccessControlPolicy policy)
        {
            var MongoDB = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName);
            var Collec = MongoDB.GetCollection<AccessControlPolicy>(JsonAccessControlSetting.AccessControlCollectionName);
            
            Collec.InsertOneAsync(policy);
        }

        ICollection<AccessControlPolicy> IAccessControlPolicyRepository.GetAll()
        {
            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicy>(JsonAccessControlSetting.AccessControlCollectionName)
                                   .Find(_ => true)
                                   .ToList();
            return data;
        }

        ICollection<AccessControlPolicy> IAccessControlPolicyRepository.GetPolicies(string collectionName, string action, bool? isAttributeResourceRequired)
        {
            var builder = Builders<AccessControlPolicy>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action", action);

            if(isAttributeResourceRequired != null)
                filter = filter & builder.Eq("is_attribute_resource_required", isAttributeResourceRequired);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicy>(JsonAccessControlSetting.AccessControlCollectionName)
                                   .Find(filter)
                                   .ToList();
            return data;
        }

        ICollection<AccessControlPolicy> IAccessControlPolicyRepository.GetPoliciesWithFilter(dynamic filter)
        {
            var filterDefinition = (FilterDefinition<AccessControlPolicy>)filter;
            return _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicy>(JsonAccessControlSetting.AccessControlCollectionName)
                                   .Find(filterDefinition)
                                   .ToList();
        }

        string IAccessControlPolicyRepository.GetPolicyCombining(ICollection<AccessControlPolicy> policies)
        {
            var builder = Builders<AccessControlPolicyCombining>.Filter;
            var id = policies.ElementAt(0).PolicyId;
            var filter = builder.AnyEq("policies_id", id);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                   .GetCollection<AccessControlPolicyCombining>(JsonAccessControlSetting.AccessControlPolicyCombiningConfigurtaion)
                                   .Find(filter)
                                   .FirstOrDefault();
            return data == null ? "permit-overrides": data.Algorithm;
        }
    }
}
