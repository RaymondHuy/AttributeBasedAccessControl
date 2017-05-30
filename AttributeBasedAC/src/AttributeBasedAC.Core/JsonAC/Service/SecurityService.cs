using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class SecurityService : ISecurityService
    {
        private readonly IAccessControlService _accessControlService;
        private readonly IPrivacyService _privacyService;

        public SecurityService(IAccessControlService accessControlService, IPrivacyService privacyService)
        {
            _accessControlService = accessControlService;
            _privacyService = privacyService;
        }

        ResponseContext ISecurityService.ExecuteProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment)
        {
            var result = _accessControlService.ExecuteProcess(user, resource, action, collectionName, environment);
            //var temp = result.JsonObjects.Count;
            if (result.Effect == EffectResult.Permit)
            {
                result = _privacyService.ExecuteProcess(user, result.JsonObjects.ToArray(), action, collectionName, environment);
            }
            //Console.WriteLine("Initian length "  + resource.Length);
            //Console.WriteLine("final " + temp);
            return result;
        }
    }
}
