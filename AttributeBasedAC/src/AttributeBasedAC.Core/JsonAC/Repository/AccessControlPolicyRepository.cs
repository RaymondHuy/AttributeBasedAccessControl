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

        ICollection<TargetSubject> IAccessControlPolicyRepository.GetAllTargetSubjects()
        {
            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.AccessControlDatabaseName)
                                   .GetCollection<TargetSubject>("PolicyTargetSubject")
                                   .Find(_ => true)
                                   .ToList();

            return data;
        }

        ICollection<PolicyAccessControl> IAccessControlPolicyRepository.GetPolicies(FilterDefinition<PolicyAccessControl> filter)
        {
            var data = _mongoClient.GetDatabase(JsonAccessControlSetting.AccessControlDatabaseName)
                                   .GetCollection<PolicyAccessControl>("PolicyExpression")
                                   .Find(filter)
                                   .ToList();
            return data;
        }
    }
}
