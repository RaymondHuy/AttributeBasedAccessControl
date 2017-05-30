using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using Newtonsoft.Json.Linq;
using AttributeBasedAC.Core.JsonAC.Repository;
using System.Threading;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class AccessControlService : IAccessControlService
    {
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IConditionalExpressionService _expressionService;

        private JObject _user;
        private JObject _environment;
        private string _collectionName;
        private string _action;

        public AccessControlService(
            IAccessControlPolicyRepository accessControlPolicyRepository,
            IConditionalExpressionService expressionService)
        {
            _accessControlPolicyRepository = accessControlPolicyRepository;
            _expressionService = expressionService;
        }

        ResponseContext IAccessControlService.ExecuteProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment)
        {
            _user = user;
            _collectionName = collectionName;
            _action = action;
            _environment = environment;

            environment.AddAnnotation(action);

            EffectResult effect = CollectionAccessControlProcess();
            if (effect == EffectResult.Deny)
                return new ResponseContext(EffectResult.Deny, null);
            else if (effect == EffectResult.Permit)
                return new ResponseContext(EffectResult.Permit, resource);

            var accessControlRecordPolicies = _accessControlPolicyRepository.GetPolicies(collectionName, action, true);

            if (accessControlRecordPolicies.Count == 0)
                return new ResponseContext(EffectResult.Deny, null);

            string policyCombining = _accessControlPolicyRepository.GetPolicyCombining(accessControlRecordPolicies);

            ICollection<JObject> _resource = new List<JObject>();
            if (resource.Length > 1000)
            {
                Parallel.ForEach(resource, record =>
                {
                    if (RowAccessControlProcess(record, policyCombining, accessControlRecordPolicies) != null)
                    {
                        lock (_resource)
                            _resource.Add(record);
                    }
                });
            }
            else
            {
                foreach (var record in resource)
                {
                    if (RowAccessControlProcess(record, policyCombining, accessControlRecordPolicies) != null)
                        _resource.Add(record);
                }
            }
            if (_resource.Count == 0)
                return new ResponseContext(EffectResult.Deny, null);

            return new ResponseContext(EffectResult.Permit, _resource);

        }

        ICollection<AccessControlPolicy> IAccessControlService.Review(JObject user, JObject resource, JObject environment)
        {
            var policies = _accessControlPolicyRepository.GetAll();
            var result = new List<AccessControlPolicy>();
            foreach (var policy in policies)
            {
                if (_expressionService.IsAccessControlPolicyRelateToContext(policy, user, resource, environment))
                    result.Add(policy);
            }
            return result;
        }

        private EffectResult CollectionAccessControlProcess()
        {
            EffectResult result = EffectResult.NotApplicable;

            ICollection<AccessControlPolicy> collectionPolicies = _accessControlPolicyRepository.GetPolicies(_collectionName, _action, false);

            if (collectionPolicies.Count == 0)
                return EffectResult.NotApplicable;

            string policyCombining = _accessControlPolicyRepository.GetPolicyCombining(collectionPolicies);

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


        private JObject RowAccessControlProcess(JObject resource, string policyCombining, ICollection<AccessControlPolicy> policies)
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

    }
}
