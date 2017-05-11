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
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IConditionalExpressionService             _expressionService;
        private readonly IPrivacyDomainRepository     _privacyFunctionRepository;
        private readonly IPrivacyPolicyRepository       _privacyPolicyRepository;

        private ICollection<JObject> _resource;
        private JObject   _user;
        private JObject   _environment;
        private string    _collectionName;
        private string    _action;
        private string    _policyCombining;

        private IDictionary<string, string> _collectionPrivacyRules;


        public AccessControlPrivacyService(
            IAccessControlPolicyRepository accessControlPolicyRepository,
            IConditionalExpressionService expressionService,
            IPrivacyDomainRepository privacyFunctionRepository,
            IPrivacyPolicyRepository privacyPolicyRepository)
        {
            _accessControlPolicyRepository = accessControlPolicyRepository;
            _expressionService = expressionService;
            _privacyFunctionRepository = privacyFunctionRepository;
            _privacyPolicyRepository = privacyPolicyRepository;
        }

        ResponseContext IAccessControlPrivacyService.ExecuteSecurityProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment)
        {
            _user = user;
            _collectionName = collectionName;
            _action = action;
            _environment = environment;
            _policyCombining = _accessControlPolicyRepository.GetPolicyCombining(collectionName, action);
            
            environment.AddAnnotation(action);
            EffectResult effect = AccessControlCollectionPolicyProcessing();
            if (effect == EffectResult.Deny)
                return new ResponseContext(EffectResult.Deny, null);

            var accessControlRecordPolicies = _accessControlPolicyRepository.GetPolicies(collectionName, action, true);
            _resource = new List<JObject>();

            foreach (var record in resource)
            {
                if (AccessControlRecordPolicyProcessing(record, _policyCombining, accessControlRecordPolicies) != null)
                    _resource.Add(record);
            }

            if (_resource.Count == 0)
                return new ResponseContext(EffectResult.Deny, null);

            if (!action.Equals("read"))
                return new ResponseContext(EffectResult.Permit, _resource);

            _collectionPrivacyRules = GetFieldCollectionRules();
            var privacyRecords = new List<JObject>();
            
            //Parallel.ForEach(_resource, record =>
            //{
            //    var privacyField = GetPrivacyRecordField(record, policies);
            //    var privacyRecord = PrivacyProcessing(record, privacyField);
            //    Console.WriteLine(privacyRecord);
            //    privacyRecords.Add(privacyRecord);
            //});
            foreach (var record in _resource)
            {
                Console.WriteLine(DateTime.Now.Millisecond) ;
                var privacyFields = GetPrivacyRecordField(record);
                var privacyRecord = PrivacyProcessing(record, privacyFields);
                Console.WriteLine(DateTime.Now.Millisecond);
                privacyRecords.Add(privacyRecord);
            }
            return new ResponseContext(EffectResult.Permit, privacyRecords);
        }

        ICollection<AccessControlPolicy> IAccessControlPrivacyService.Review(ICollection<AccessControlPolicy> policies, JObject user, JObject resource, JObject environment)
        {
            var result = new List<AccessControlPolicy>();
            foreach (var policy in policies)
            {
                if (_expressionService.IsAccessControlPolicyRelateToContext(policy, user, resource, environment))
                    result.Add(policy);
            }
            return result;
        }

        /// <summary>Get the privacy rule of collection fields
        /// <para>List policy Access Control</para>
        /// </summary>
        private IDictionary<string, string> GetFieldCollectionRules()
        {
            var policies = _privacyPolicyRepository.GetPolicies(_collectionName, _action, false);
            var targetPolicies = new List<PrivacyPolicy>();
            foreach (var policy in policies)
            {
                bool isTarget = _expressionService.Evaluate(policy.Target, _user, null, _environment);
                if (isTarget)
                    targetPolicies.Add(policy);
            }
            var fieldCollectionRules = new Dictionary<string, string>();
            foreach (var policy in targetPolicies)
            {
                foreach (var collectionField in policy.Rules)
                {
                    bool isApplied = _expressionService.Evaluate(collectionField.Condition, _user, null, _environment);
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
                else if (field.FunctionApply.Equals("Optional") || field.FunctionApply.Equals(privacyRules[field.Name]))
                {
                    continue;
                }
                else if (privacyRules[field.Name].Equals("Optional") || privacyRules[field.Name].Equals("DefaultPrivacyFunction.Show"))
                {
                    privacyRules[field.Name] = field.FunctionApply;
                }
                else if (field.FunctionApply.Equals("DefaultPrivacyFunction.Hide"))
                {
                    privacyRules[field.Name] = field.FunctionApply;
                }
                else
                {
                    privacyRules[field.Name] = _privacyFunctionRepository.ComparePrivacyFunction(privacyRules[field.Name], field.FunctionApply);
                }
            }
        }

        private IDictionary<string, string> GetPrivacyRecordField(JObject record)
        {
            var policies = _privacyPolicyRepository.GetPolicies(_collectionName, _action, true);
            var targetPolicies = new List<PrivacyPolicy>();
            foreach (var policy in policies)
            {
                bool isTarget = _expressionService.Evaluate(policy.Target, _user, record, _environment);
                if (isTarget)
                    targetPolicies.Add(policy);
            }
            IDictionary<string, string> recordPrivacyRules = _collectionPrivacyRules.ToDictionary(entry => entry.Key, entry => entry.Value);
            //Privacy checking
            foreach (var policy in targetPolicies)
            {
                foreach (var rule in policy.Rules)
                {
                    bool isRuleApplied = _expressionService.Evaluate(rule.Condition, _user, record, _environment);
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
                if (privacyField[fieldName] != "Optional") {
                    string json = record.SelectToken(fieldName).ToString();
                    try
                    {
                        var token = JToken.Parse(json);
                        if (token is JArray)
                        {
                            var arr = JArray.Parse(record.SelectToken(fieldName).ToString());
                            privacyRecord[fieldName] = RecursivePrivacyProcess(privacyField[fieldName], arr);
                        }
                        else privacyRecord.AddNewFieldFromPath(fieldName, record, privacyField[fieldName]);
                    }
                    catch (Exception)
                    {
                        privacyRecord.AddNewFieldFromPath(fieldName, record, privacyField[fieldName]);
                    }
                }
            }
            return privacyRecord;
        }

        private JArray RecursivePrivacyProcess(string policyName, JArray nestedArrayResource)
        {
            var policyID = policyName.Split('.')[1];
            var policy = _privacyPolicyRepository.GetPolicy(policyID);
            var result = new JArray();
            foreach (var token in nestedArrayResource)
            {
                var record = (JObject)token;
                var fieldCollectionRules = new Dictionary<string, string>();
                foreach (var rule in policy.Rules)
                {
                    bool isRuleApplied = _expressionService.Evaluate(rule.Condition, _user, record, _environment);
                    if (isRuleApplied)
                    {
                        foreach (var fieldEffect in rule.FieldEffects)
                        {
                            if (!fieldCollectionRules.ContainsKey(fieldEffect.Name))
                                fieldCollectionRules.Add(fieldEffect.Name, fieldEffect.FunctionApply);
                            else fieldCollectionRules[fieldEffect.Name] = fieldEffect.FunctionApply;
                        }
                    }
                }
                result.Add(PrivacyProcessing(record, fieldCollectionRules));
            }
            return result;
        }

        private void CombinePrivacyFields(IDictionary<string, string> privacyRules, ICollection<FieldEffect> bonusFields)
        {
            foreach (FieldEffect field in bonusFields)
            {
                if (field.FunctionApply.Equals("Optional") || field.FunctionApply.Equals(privacyRules[field.Name]))
                {
                    continue;
                }
                else if (privacyRules[field.Name].Equals("Optional") || privacyRules[field.Name].Equals("DefaultPrivacyFunction.Show"))
                {
                    privacyRules[field.Name] = field.FunctionApply;
                }
                else if (field.FunctionApply.Equals("DefaultPrivacyFunction.Hide"))
                {
                    privacyRules[field.Name] = field.FunctionApply;
                }
                else
                {
                    privacyRules[field.Name] = _privacyFunctionRepository.ComparePrivacyFunction(privacyRules[field.Name], field.FunctionApply);
                }
            }
        }
        
        private EffectResult AccessControlCollectionPolicyProcessing()
        {
            EffectResult result = EffectResult.NotApplicable;

            string policyCombining = _accessControlPolicyRepository.GetPolicyCombining(_collectionName, _action);
            ICollection<AccessControlPolicy> collectionPolicies = _accessControlPolicyRepository.GetPolicies(_collectionName, _action, false);
            var targetPolicies = new List<AccessControlPolicy>();
            foreach (var policy in collectionPolicies)
            {
                bool isTarget = _expressionService.Evaluate(policy.Target, _user, null, _environment);
                if (isTarget)
                    targetPolicies.Add(policy);
            }

            foreach (var policy in targetPolicies)
            {
                string policyEffect = String.Empty;

                foreach (var rule in policy.Rules)
                {
                    bool isApplied = _expressionService.Evaluate(rule.Condition, _user, null, _environment);
                    if (isApplied && rule.Effect.Equals("Permit") && policy.RuleCombining.Equals("permit-overrides"))
                    {
                        policyEffect = "Permit";
                        break;
                    }
                    if (isApplied && rule.Effect.Equals("Deny") && policy.RuleCombining.Equals("deny-overrides"))
                    {
                        policyEffect = "Deny";
                        break;
                    }
                }
                if (policyEffect.Equals("Permit") && policyCombining.Equals("permit-overrides"))
                {
                    result = EffectResult.Permit;
                    break;
                }
                else if (policyEffect.Equals("Deny") && policyCombining.Equals("deny-overrides"))
                {
                    result = EffectResult.Deny;
                    break;
                }
            }
            return result;
        }

        private JObject AccessControlRecordPolicyProcessing(JObject resource, string policyCombining, ICollection<AccessControlPolicy> policies)
        {
            JObject result = null;
            var targetPolicy = new List<AccessControlPolicy>();
            foreach (var policy in policies)
            {
                bool isTarget = _expressionService.Evaluate(policy.Target, _user, resource, _environment);
                if (isTarget)
                    targetPolicy.Add(policy);
            }
            foreach (var policy in targetPolicy)
            {
                string policyEffect = String.Empty;

                foreach (var rule in policy.Rules)
                {
                    bool isApplied = _expressionService.Evaluate(rule.Condition, _user, resource, _environment);
                    if (isApplied && rule.Effect.Equals("Permit") && policy.RuleCombining.Equals("permit-overrides"))
                    {
                        policyEffect = "Permit";
                        break;
                    }
                    if (isApplied && rule.Effect.Equals("Deny") && policy.RuleCombining.Equals("deny-overrides"))
                    {
                        policyEffect = "Deny";
                        break;
                    }
                }
                if (policyEffect.Equals("Permit") && policyCombining.Equals("permit-overrides"))
                {
                    result = resource;
                    break;
                }
                else if (policyEffect.Equals("Deny") && policyCombining.Equals("deny-overrides"))
                {
                    result = null;
                    break;
                }
            }
            return result;
        }

        ICollection<PrivacyPolicy> IAccessControlPrivacyService.Review(ICollection<PrivacyPolicy> policies, JObject user, JObject resource, JObject environment)
        {
            var result = new List<PrivacyPolicy>();
            foreach (var policy in policies)
            {
                if (_expressionService.IsPrivacyPolicyRelateToContext(policy, user, resource, environment))
                    result.Add(policy);
            }
            return result;
        }
    }
    
}
