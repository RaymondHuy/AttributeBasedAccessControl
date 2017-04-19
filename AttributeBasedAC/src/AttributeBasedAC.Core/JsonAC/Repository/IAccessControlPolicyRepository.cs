using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public interface IAccessControlPolicyRepository
    {
        ICollection<AccessControlPolicy> GetPolicies(string collectionName, string action, bool isAttributeResourceRequired);

        string GetPolicyCombining(string collectionName, string action);
    }
}
