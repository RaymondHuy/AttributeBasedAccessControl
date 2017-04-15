using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.WebAPI.Command;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class PrivacyController : Controller
    {
        private readonly IAccessControlPrivacyService _accessControlPrivacyService;

        public PrivacyController(IAccessControlPrivacyService accessControlPrivacyService)
        {
            _accessControlPrivacyService = accessControlPrivacyService;
        }

        [HttpPost]
        [Route("api/Privacy/Check")]
        public IEnumerable<string> Check([FromBody]PrivacyCheckingCommand command)
        {
            Console.WriteLine(command);
            return new string[] { "value1", "value2" };
        }
    }
}
