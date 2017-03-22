using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Repository;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class AccessControlService : IAccessControlService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IEnvironmentRepository _environmentRepository;
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;
        private readonly IExpressionService _expressionService;

        public AccessControlService(
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

        ResponseContext IAccessControlService.GetDataForSubject(RequestContext request)
        {
            var user = _subjectRepository.GetUniqueUser(request.Subject.Name, request.Subject.FilterCondition);
            var resource = _resourceRepository.GetCollectionDataWithCustomFilter(request.Resource.Name, request.Resource.FilterCondition);
            _environmentRepository.SetEnvironmentData(request.EnvironmentData);

            var targetSubjectID = FilterTargetSubjectByUser(user).Select(t => t.Id.ToString());
            var builder = Builders<PolicyAccessControl>.Filter;
            var filter = builder.In("target_subject_id", targetSubjectID) 
                        & builder.Eq("collection_name", request.Resource.Name);
            var policies = _accessControlPolicyRepository.GetPolicies(filter);

            foreach (var row in resource)
            {
                bool Permit = _expressionService.Evaluate(policies.ElementAt(0).RecordRules, user, row, request.EnvironmentData);
            }

            return null;
        }

        private ICollection<TargetSubject> FilterTargetSubjectByUser(JObject user)
        {
            var targetSubjects = _accessControlPolicyRepository.GetAllTargetSubjects();
            ICollection<TargetSubject> result = new List<TargetSubject>();

            //result = targetSubjects.Where(n => _expressionService.Evaluate(n.TargetSubjects)).ToList();
            result = targetSubjects;

            return result;
        }
    }
}
