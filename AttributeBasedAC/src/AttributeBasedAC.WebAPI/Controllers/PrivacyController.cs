using AttributeBasedAC.Core.JsonAC;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.WebAPI.Command;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class PrivacyController : Controller
    {
        private readonly IAccessControlPrivacyService _accessControlPrivacyService;
        private readonly ISubjectRepository _subjectRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IPrivacyDomainRepository _privacyDomainRepository;
        private readonly IConditionalExpressionService _conditionalExpressionService;
        private readonly IPrivacyPolicyRepository _privacyPolicyRepository;

        public PrivacyController(
            IAccessControlPrivacyService accessControlPrivacyService,
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IPrivacyDomainRepository privacyDomainRepository,
            IConditionalExpressionService conditionalExpressionService,
            IPrivacyPolicyRepository privacyPolicyRepository)
        {
            _accessControlPrivacyService = accessControlPrivacyService;
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _privacyDomainRepository = privacyDomainRepository;
            _conditionalExpressionService = conditionalExpressionService;
            _privacyPolicyRepository = privacyPolicyRepository;
        }

        [HttpPost]
        [Route("api/Privacy/Check")]
        public string Check([FromBody]PrivacyCheckingCommand command)
        {
            var userFilter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(command.UserID));
            var subject = _subjectRepository.GetUniqueUser(JsonAccessControlSetting.UserDefaultCollectionName, userFilter);
            var environment = string.IsNullOrEmpty(command.Environment) ? null : JObject.Parse(command.Environment);
            var resource = _resourceRepository.GetCollectionDataWithCustomFilter(command.ResourceName, null);
            var action = command.Action;
            var result = _accessControlPrivacyService.ExecuteSecurityProcess(subject, resource, action, command.ResourceName, environment);

            if (result.Effect == EffectResult.Deny)
                return "Deny";

            var builder = new StringBuilder();
            builder.Append("[");
            foreach (var json in result.Data)
            {
                builder.Append(json.ToString());
            }
            builder.Append("]");
            return builder.ToString();
        }

        [HttpGet]
        [Route("api/PrivacyFunctions")]
        public IEnumerable<string> GetPrivacyFunctions()
        {
            return _privacyDomainRepository.GetAllPrivacyFunctionName();
        }

        [HttpPost]
        [Route("api/PrivacyPolicy")]
        public void Create([FromBody]PrivacyPolicyInsertCommand command)
        {
            var fieldRules = new List<FieldRule>();

            foreach (var rule in command.Rules)
            {
                var condition = _conditionalExpressionService.Parse(rule.Condition);
                var fieldRule = new FieldRule()
                {
                    Identifer = rule.RuleID,
                    FieldEffects = rule.FieldEffects,
                    Condition = condition
                };
                fieldRules.Add(fieldRule);
            }

            var policy = new PrivacyPolicy()
            {
                CollectionName = command.CollectionName,
                Action = command.Action,
                Description = command.Description,
                PolicyId = command.PolicyID,
                Rules = fieldRules,
                IsAttributeResourceRequired = true
            };
            _privacyPolicyRepository.Add(policy);
        }

        [HttpPost]
        [Route("api/Privacy/Review")]
        public IEnumerable<string> Review([FromBody]PolicyReviewCommand command)
        {
            JObject user = string.IsNullOrEmpty(command.UserJsonData) ? new JObject() : JObject.Parse(command.UserJsonData);
            JObject resource = string.IsNullOrEmpty(command.ResourceJsonData) ? new JObject() : JObject.Parse(command.ResourceJsonData);
            JObject environment = string.IsNullOrEmpty(command.EnvironmentJsonData) ? new JObject() : JObject.Parse(command.EnvironmentJsonData);

            var policies = _privacyPolicyRepository.GetPolicies(command.CollectionName, command.Action, null);
            var relativePolicies = _accessControlPrivacyService.Review(policies, user, resource, environment);

            return relativePolicies.Select(p => p.PolicyId).ToList();
        }

        [HttpGet]
        [Route("api/PrivacyFunction")]
        public IEnumerable<string> GetPrivacyFunction(string name)
        {
            return _privacyDomainRepository.GetPrivacyFunctionNames(name);
        }

        [HttpGet]
        [Route("api/PrivacyDomain")]
        public IEnumerable<string> GetAllPrivacyDomain()
        {
            var container = PrivacyDomainPluginFactory.GetInstance();

            return container.GetAllDomainType();
        }

    }
}
