using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.WebAPI.Command;
using AttributeBasedAC.WebAPI.Controllers;
using Autofac;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace AttributeBasedAC.Test.WebApiTesting
{
    public class PrivacyControllerTest
    {
        [Fact]
        public void CheckTesting(ILifetimeScope scope)
        {
            var accessControlPrivacyService = scope.Resolve<IAccessControlPrivacyService>();
            var subjectRepository = scope.Resolve<ISubjectRepository>();
            var resourceRepository = scope.Resolve<IResourceRepository>();
            var privacyDomain = scope.Resolve<IPrivacyDomainRepository>();
            
            //var privacyController = new PrivacyController(accessControlPrivacyService, subjectRepository, resourceRepository, privacyDomain);
            //var command = new PrivacyCheckingCommand
            //{
            //    Environment = "{ 'purpose' : 'analysis' }",
            //    ResourceName = "Department",
            //    UserID = "a4df866e-d3d0-4d01-839b-cd69fd0d6124",
            //    ResourceCondition = null,
            //    Action = "read"
            //};
            //var result = privacyController.Check(command);
            //Console.WriteLine(result.ElementAt(0)); 
        }

        [Fact]
        public void FilterMongoDbParserTesting()
        {

        }
        [Fact]
        public void PolicyReview(ILifetimeScope scope)
        {
            var accessControlPrivacyService = scope.Resolve<IAccessControlPrivacyService>();
            var subjectRepository = scope.Resolve<ISubjectRepository>();
            var resourceRepository = scope.Resolve<IResourceRepository>();
            var privacyDomain = scope.Resolve<IPrivacyDomainRepository>();
            var expressionService = scope.Resolve<IConditionalExpressionService>();
            var acPolicyRepository = scope.Resolve<IAccessControlPolicyRepository>();

            var policy = acPolicyRepository.GetAll().ElementAt(1);

            string jsonData = @"{'role': 'doctor'}";
            var data = JObject.Parse(jsonData);
            Console.WriteLine(expressionService.IsAccessControlPolicyRelateToContext(policy, data, data, data));
        }

        public void TestParseFunction()
        {
            string s = "Equal ( Resource._id , Function1 ( Resource.name , b ) ) OR Equal ( Subject.role , leader )";
        }
    }
}
