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
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IExpressionService _expressionService;
        private readonly IPrivacyFunctionRepository _privacyFunctionRepository;

        private JObject _user;
        private JObject[] _resource;
        private JObject _environment;
        private string _collectionName;
        private string _action;
        private IDictionary<string, string> _collectionPrivacyRules;

        public AccessControlPrivacyService(
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IAccessControlPolicyRepository accessControlPolicyRepository,
            IExpressionService expressionService,
            IPrivacyFunctionRepository privacyFunctionRepository)
        {
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _accessControlPolicyRepository = accessControlPolicyRepository;
            _expressionService = expressionService;
            _privacyFunctionRepository = privacyFunctionRepository;
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
            ICollection<PolicyAccessControl> policies = GetPolicies();

            _collectionPrivacyRules = GetFieldCollectionRules(policies);
            //Parallel.ForEach(_resource, record =>
            //{
            //    var privacyField = GetPrivacyRecordField(record, policies);
            //    var privacyRecord = PrivacyProcessing(record, privacyField);
            //    Console.WriteLine(privacyRecord);
            //    privacyRecords.Add(privacyRecord);
            //});
            foreach (var record in _resource)
            {
                var privacyFields = GetPrivacyRecordField(record, policies);
                var privacyRecord = PrivacyProcessing(record, privacyFields);
                privacyRecords.Add(privacyRecord);
            }
            return privacyRecords;
        }

        private ICollection<PolicyAccessControl> GetPolicies()
        {
            return _accessControlPolicyRepository.GetPolicies(_collectionName, _action);
        }

        /// <summary>Get the privacy rule of collection fields
        /// <para>List policy Access Control</para>
        /// </summary>
        private IDictionary<string, string> GetFieldCollectionRules(ICollection<PolicyAccessControl> policies)
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
                else if (field.FunctionApply == "DefaultPrivacyFunction.Hide")
                {
                    privacyRules[field.Name] = field.FunctionApply;
                }
                else if (privacyRules[field.Name] != "DefaultDomainPrivacy.Hide")
                {
                    //resolve conflict
                    if (privacyRules[field.Name].Contains("DefaultDomainPrivacy")
                        || privacyRules[field.Name].Equals("Optional"))
                    {
                        privacyRules[field.Name] = field.FunctionApply;
                    }
                    else privacyRules[field.Name] = _privacyFunctionRepository.ComparePrivacyFunction(privacyRules[field.Name], field.FunctionApply);
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
            var privacyRecord = new JObject();
            
            foreach (var fieldName in privacyField.Keys)
            {
                if (privacyField[fieldName] != "Optional")
                {
                    privacyRecord.AddNewFieldFromPath(fieldName, record, privacyField[fieldName]);
                }
            }
            return privacyRecord;
        }

        private void CombinePrivacyFields(IDictionary<string, string> privacyRules, ICollection<FieldEffect> bonusFields)
        {
            foreach (FieldEffect fieldEffect in bonusFields)
            {
                if (fieldEffect.FunctionApply == "DefaultDomainPrivacy.Hide")
                {
                    privacyRules[fieldEffect.Name] = "DefaultDomainPrivacy.Hide";
                }
                else if (privacyRules[fieldEffect.Name] != "DefaultDomainPrivacy.Hide")
                {
                    //resolve conflict
                    if (privacyRules[fieldEffect.Name].Contains("DefaultDomainPrivacy")
                        || privacyRules[fieldEffect.Name].Equals("Optional"))
                    {
                        privacyRules[fieldEffect.Name] = fieldEffect.FunctionApply;
                    }
                    else privacyRules[fieldEffect.Name] = _privacyFunctionRepository.ComparePrivacyFunction(privacyRules[fieldEffect.Name], fieldEffect.FunctionApply);        
                }
            }
        }
    }
}
