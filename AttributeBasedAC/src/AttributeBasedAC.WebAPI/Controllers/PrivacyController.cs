using AttributeBasedAC.Core.JsonAC;
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

        public PrivacyController(
            IAccessControlPrivacyService accessControlPrivacyService,
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IPrivacyDomainRepository privacyDomainRepository)
        {
            _accessControlPrivacyService = accessControlPrivacyService;
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _privacyDomainRepository = privacyDomainRepository;
        }

        [HttpPost]
        [Route("api/Privacy/Check")]
        public string Check([FromBody]PrivacyCheckingCommand command)
        {
            var userFilter = Builders<BsonDocument>.Filter.Eq("_id", command.UserID);
            var subject = _subjectRepository.GetUniqueUser(JsonAccessControlSetting.UserDefaultCollectionName, userFilter);
            var environment = string.IsNullOrEmpty(command.Environment) ? null : JObject.Parse(command.Environment);
            var resource = _resourceRepository.GetCollectionDataWithCustomFilter(command.ResourceName, null);
            var action = command.Action;
            var result = _accessControlPrivacyService.ExecuteSecurityProcess(subject, resource, action, command.ResourceName, environment);

            var builder = new StringBuilder();
            builder.Append("[");
            foreach (var json in result)
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
    }
}
