using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using Newtonsoft.Json.Linq;
using AttributeBasedAC.Core.JsonAC.Repository;

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
        private string _policyCombining;

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

            EffectResult effect = AccessControlCollectionPolicyProcessing();
            if (effect == EffectResult.Deny)
                return new ResponseContext(EffectResult.Deny, null);

            var accessControlRecordPolicies = _accessControlPolicyRepository.GetPolicies(collectionName, action, true);
            _policyCombining = _accessControlPolicyRepository.GetPolicyCombining(accessControlRecordPolicies);

            ICollection<JObject> _resource = new List<JObject>();

            foreach (var record in resource)
            {
                if (AccessControlRecordPolicyProcessing(record, _policyCombining, accessControlRecordPolicies) != null)
                    _resource.Add(record);
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

        private EffectResult AccessControlCollectionPolicyProcessing()
        {
            EffectResult result = EffectResult.NotApplicable;

            ICollection<AccessControlPolicy> collectionPolicies = _accessControlPolicyRepository.GetPolicies(_collectionName, _action, false);
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

    }
}
