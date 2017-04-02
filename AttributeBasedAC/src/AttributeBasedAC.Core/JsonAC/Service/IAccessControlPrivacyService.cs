using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public interface IAccessControlPrivacyService
    {
        ICollection<JObject> ExecuteSecurityProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment);
    }
}
