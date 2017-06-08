using AttributeBasedAC.Core.JsonAC;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.WebAPI.Command;
using AttributeBasedAC.WebAPI.Utilities;
using AttributeBasedAC.WebAPI.ViewModel;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class PrivacyPolicyController : Controller
    {
        private readonly ISecurityService _securityService;
        private readonly ISubjectRepository _subjectRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IPrivacyDomainRepository _privacyDomainRepository;
        private readonly IConditionalExpressionService _conditionalExpressionService;
        private readonly IPrivacyPolicyRepository _privacyPolicyRepository;
        private readonly IPrivacyService _privacyService;

        public PrivacyPolicyController(
            ISecurityService securityService,
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IConditionalExpressionService conditionalExpressionService,
            IPrivacyPolicyRepository privacyPolicyRepository,
            IPrivacyService privacyService,
            IPrivacyDomainRepository privacyDomainRepository)
        {
            _securityService = securityService;
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _conditionalExpressionService = conditionalExpressionService;
            _privacyPolicyRepository = privacyPolicyRepository;
            _privacyService = privacyService;
            _privacyDomainRepository = privacyDomainRepository;
        }

        [HttpPost]
        [Route("api/Privacy/Check")]
        public string Check([FromBody]PrivacyCheckingCommand command)
        {
            var userFilter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(command.UserID));
            var subject = _subjectRepository.GetUniqueUser(JsonAccessControlSetting.UserDefaultCollectionName, userFilter);
            var environment = string.IsNullOrEmpty(command.Environment) || command.Environment == "{}" ? null : JObject.Parse(command.Environment);
            var resource = _resourceRepository.GetCollectionDataWithCustomFilter(command.ResourceName, null);
            var action = command.Action;
            Stopwatch s1 = Stopwatch.StartNew();
            var result = _securityService.ExecuteProcess(subject, resource, action, command.ResourceName, environment);
            s1.Stop();
            Console.WriteLine(s1.ElapsedMilliseconds);
            if (result.Effect == EffectResult.Deny)
                return "Deny";
            if (result.Effect == EffectResult.NotApplicable)
                return "Not Applicable";
            return result.Data == null ? "" : result.Data.ToString();
        }


        [HttpPost]
        [Route("api/PrivacyPolicy")]
        public void Create([FromBody]PrivacyPolicyInsertCommand command)
        {
            bool IsResourceRequired = false;

            if (command.Target.Contains("\"Resource."))
                IsResourceRequired = true;

            var fieldRules = new List<FieldRule>();
            var target = _conditionalExpressionService.Parse(command.Target);
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

                if (!IsResourceRequired)
                    IsResourceRequired = rule.Condition.Contains("\"Resource.");
            }

            var policy = new PrivacyPolicy()
            {
                CollectionName = command.CollectionName,
                Description = command.Description,
                PolicyId = command.PolicyID,
                Rules = fieldRules,
                IsAttributeResourceRequired = IsResourceRequired,
                Target = target
            };
            _privacyPolicyRepository.Add(policy);
        }
        [HttpPost]
        [Route("api/SubPrivacyPolicy")]
        public void Create([FromBody]SubPrivacyPolicyInsertCommand command)
        {
            bool IsResourceRequired = true;

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

                if (!IsResourceRequired)
                    IsResourceRequired = rule.Condition.Contains("\"Resource.");
            }

            var policy = new PrivacyPolicy()
            {
                CollectionName = command.CollectionName,
                Description = command.Description,
                PolicyId = command.PolicyID,
                Rules = fieldRules,
                IsAttributeResourceRequired = IsResourceRequired
            };
            _privacyPolicyRepository.Add(policy);

            var priorty = new PriorityFunction() { Name = command.PolicyID, Priority = command.Priority };
            _privacyDomainRepository.AddPriorityFunctions(command.DomainName, priorty);

        }

        [HttpPost]
        [Route("api/Privacy/Review")]
        public IEnumerable<PrivacyPolicy> Review([FromBody]PolicyReviewCommand command)
        {
            JObject user = string.IsNullOrEmpty(command.UserJsonData) ? new JObject() : JObject.Parse(command.UserJsonData);
            JObject resource = string.IsNullOrEmpty(command.ResourceJsonData) ? new JObject() : JObject.Parse(command.ResourceJsonData);
            JObject environment = string.IsNullOrEmpty(command.EnvironmentJsonData) ? new JObject() : JObject.Parse(command.EnvironmentJsonData);

            var relativePolicies = _privacyService.Review(user, resource, environment);

            return relativePolicies;
        }

        [HttpGet]
        [Route("api/PrivacyPolicy")]
        public IEnumerable<PrivacyPolicyViewModel> PrivacyPolicy()
        {
            var policies = _privacyPolicyRepository.GetAll();
            var result = new List<PrivacyPolicyViewModel>();
            foreach (var policy in policies)
            {
                result.Add(new PrivacyPolicyViewModel()
                {
                    CollectionName = policy.CollectionName,
                    Description = policy.Description,
                    PolicyId = policy.PolicyId,
                    Target = FunctionUtility.Convert(policy.Target)
                });
            }
            return result;
        }

        [HttpDelete]
        [Route("api/PrivacyPolicy")]
        public void PrivacyPolicy(string policyID)
        {
            _privacyPolicyRepository.Delete(policyID);
        }

        [HttpGet]
        [Route("api/ArrayFields")]
        public IEnumerable<string> ArrayFields()
        {
            return _privacyPolicyRepository.GetArrayFieldName();
        }
    }
}
