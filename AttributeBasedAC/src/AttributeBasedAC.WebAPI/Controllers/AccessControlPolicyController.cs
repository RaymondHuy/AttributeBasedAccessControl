using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AttributeBasedAC.WebAPI.Command;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class AccessControlPolicyController : Controller
    {
        private readonly IConditionalExpressionService _conditionalExpressionService;
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IAccessControlPrivacyService _accessControlPrivacyService;

        public AccessControlPolicyController(
            IConditionalExpressionService conditionalExpressionService,
            IAccessControlPolicyRepository accessControlPolicyRepository,
            IAccessControlPrivacyService accessControlPrivacyService)
        {
            _conditionalExpressionService = conditionalExpressionService;
            _accessControlPolicyRepository = accessControlPolicyRepository;
            _accessControlPrivacyService = accessControlPrivacyService;
        }
        // POST api/values
        [HttpPost]
        [Route("api/AccessControlPolicy")]
        public void Post([FromBody]AccessControlPolicyInsertCommand command)
        {
            var accessControlRules = new List<AccessControlRule>();
            foreach (var rule in command.Rules)
            {
                var condition = _conditionalExpressionService.Parse(rule.Condition);
                var accessControlRule = new AccessControlRule()
                {
                    Id = rule.RuleID,
                    Effect = rule.Effect,
                    Condition = condition
                };
                accessControlRules.Add(accessControlRule);
            }
            var target = _conditionalExpressionService.Parse(command.Target);
            var accessControlModel = new AccessControlPolicy()
            {
                CollectionName = command.CollectionName,
                Action = command.Action,
                Description = command.Description,
                RuleCombining = command.RuleCombining,
                Target = target,
                Rules = accessControlRules,
                IsAttributeResourceRequired = command.IsAttributeResourceRequired
            };
            _accessControlPolicyRepository.Add(accessControlModel);
        }

        [HttpPost]
        [Route("api/AccessControl/Review")]
        public IEnumerable<string> Review([FromBody]PolicyReviewCommand command)
        {
            JObject user = string.IsNullOrEmpty(command.UserJsonData) ? new JObject() : JObject.Parse(command.UserJsonData);
            JObject resource = string.IsNullOrEmpty(command.ResourceJsonData) ? new JObject() : JObject.Parse(command.ResourceJsonData);
            JObject environment = string.IsNullOrEmpty(command.EnvironmentJsonData) ? new JObject() : JObject.Parse(command.EnvironmentJsonData);

            var policies = _accessControlPolicyRepository.GetPolicies(command.CollectionName, command.Action, null);
            var relativePolicies = _accessControlPrivacyService.Review(policies, user, resource, environment);

            return relativePolicies.Select(p => p.PolicyId).ToList();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
