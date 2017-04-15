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
        
        ICollection<PolicyAccessControl> IAccessControlPolicyRepository.GetPolicies(string collectionName, string action)
        {
            var builder = Builders<PolicyAccessControl>.Filter;
            var filter = builder.Eq("collection_name", collectionName)
                       & builder.Eq("action_subject", action);

            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.AccessControlDatabaseName)
                                   .GetCollection<PolicyAccessControl>("PolicyExpression")
                                   .Find(filter)
                                   .ToList();
            return data;
        }
    }
}
