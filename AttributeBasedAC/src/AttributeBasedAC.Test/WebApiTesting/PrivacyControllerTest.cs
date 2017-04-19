using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.WebAPI.Command;
using AttributeBasedAC.WebAPI.Controllers;
using Autofac;
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
            var privacyController = new PrivacyController(accessControlPrivacyService, subjectRepository, resourceRepository);
            var command = new PrivacyCheckingCommand
            {
                Environment = "{ 'purpose' : 'analysis' }",
                ResourceName = "Department",
                UserID = "a4df866e-d3d0-4d01-839b-cd69fd0d6124",
                ResourceCondition = null,
                Action = "read"
            };
            var result = privacyController.Check(command);
            Console.WriteLine(result.ElementAt(0)); 
        }

        [Fact]
        public void FilterMongoDbParserTesting()
        {

        }
    }
}
