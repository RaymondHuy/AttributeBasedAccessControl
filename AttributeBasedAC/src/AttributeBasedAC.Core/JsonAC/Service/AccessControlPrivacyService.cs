using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.NewtonsoftExtension;
using System.Diagnostics;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class AccessControlPrivacyService : IAccessControlPrivacyService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IEnvironmentRepository _environmentRepository;
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IExpressionService _expressionService;

        private JObject _user;
        private JObject[] _resource;
        private JObject _environment;
        private string _collectionName;
        private string _action;
        private IDictionary<string, string> _collectionPrivacyRules;

        public AccessControlPrivacyService(
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IEnvironmentRepository environmentRepository,
            IAccessControlPolicyRepository accessControlPolicyRepository,
            IExpressionService expressionService)
        {
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _environmentRepository = environmentRepository;
            _accessControlPolicyRepository = accessControlPolicyRepository;
            _expressionService = expressionService;
        }

        private ICollection<PolicyAccessControl> GetPolicies()
        {
            var policies = _accessControlPolicyRepository.GetPolicies(_collectionName, _action);

            return policies;
        }

        ICollection<JObject> IAccessControlPrivacyService.ExecuteSecurityProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment)
        {
            _user = user;
            _resource = resource;
            _collectionName = collectionName;
            _action = action;
            environment.AddAnnotation(action);
            _environment = environment;
            var privacyRecords = new List<JObject>();
            var policies = GetPolicies();

            _collectionPrivacyRules = FilterFieldCollectionEffects(policies);
            //Parallel.ForEach(_resource, record =>
            //{
            //    var privacyField = GetPrivacyRecordField(record, policies);
            //    var privacyRecord = PrivacyProcessing(record, privacyField);
            //    Console.WriteLine(privacyRecord);
            //    privacyRecords.Add(privacyRecord);
            //});
            foreach (var record in _resource)
            {
                var privacyField = GetPrivacyRecordField(record, policies);
                var privacyRecord = PrivacyProcessing(record, privacyField);
                privacyRecords.Add(privacyRecord);
            }
            return privacyRecords;
        }

        private IDictionary<string, string> FilterFieldCollectionEffects(ICollection<PolicyAccessControl> policies)
        {
            var fieldCollectionRules = new Dictionary<string, string>();
            foreach (var policy in policies)
            {
                foreach (var collectionField in policy.CollectionFieldRules)
                {
                    bool isApplied = _expressionService.Evaluate(collectionField.Rules, _user, null, _environment);
                    if (isApplied)
                    {
                        InsertPrivacyRule(fieldCollectionRules, collectionField.FieldEffects);
                    }
                }
            }
            return fieldCollectionRules;
        }
        private void InsertPrivacyRule(IDictionary<string, string> privacyRules, ICollection<FieldEffect> bonusFields)
        {
            foreach (var field in bonusFields)
            {
                if (!privacyRules.Keys.Contains(field.Name))
                {
                    privacyRules.Add(field.Name, field.FunctionApply);
                }
                else
                {
                    if (field.FunctionApply == "Hide")
                        privacyRules[field.Name] = field.FunctionApply;
                }
            }
        }
        private IDictionary<string, string> GetPrivacyRecordField(JObject record, ICollection<PolicyAccessControl> policies)
        {
            IDictionary<string, string> recordPrivacyRules = _collectionPrivacyRules.ToDictionary(entry => entry.Key, entry => entry.Value);
            //Privacy checking
            foreach (var policy in policies)
            {
                foreach (var rule in policy.RecordFieldRules)
                {
                    bool isRuleApplied = _expressionService.Evaluate(rule.Rules, _user, record, _environment);
                    if (isRuleApplied)
                    {
                        CombinePrivacyFields(recordPrivacyRules, rule.FieldEffects);
                    }
                }
            }
            return recordPrivacyRules;
        }

        private JObject PrivacyProcessing(JObject record, IDictionary<string, string> privacyField)
        {
            JObject privacyRecord = new JObject();
            
            foreach (var fieldName in privacyField.Keys)
            {
                if (privacyField[fieldName] == "Show")
                {
                    privacyRecord.AddNewFieldFromPath(fieldName, record);
                }
            }
            return privacyRecord;
        }

        private void CombinePrivacyFields(IDictionary<string, string> privacyRules, ICollection<FieldEffect> bonusFields)
        {
            foreach (var fieldEffect in bonusFields)
            {
                if (privacyRules[fieldEffect.Name] == "Optional")
                {
                    privacyRules[fieldEffect.Name] = fieldEffect.FunctionApply;
                }
                else if (privacyRules[fieldEffect.Name] == "Show" && fieldEffect.FunctionApply == "Hide")
                {
                    privacyRules[fieldEffect.Name] = "Hide";
                }
            }
        }
        
    }
}
