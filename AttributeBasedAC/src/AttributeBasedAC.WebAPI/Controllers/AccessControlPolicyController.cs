using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AttributeBasedAC.WebAPI.Command;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Bson;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace AttributeBasedAC.WebAPI.Controllers
{
    public class AccessControlPolicyController : Controller
    {
        private readonly IConditionalExpressionService _conditionalExpressionService;
        private readonly IAccessControlPolicyRepository _accessControlPolicyRepository;

        public AccessControlPolicyController(
            IConditionalExpressionService conditionalExpressionService,
            IAccessControlPolicyRepository accessControlPolicyRepository)
        {
            _conditionalExpressionService = conditionalExpressionService;
            _accessControlPolicyRepository = accessControlPolicyRepository;
        }

        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        [Route("api/AccessControlPolicy")]
        public void Post([FromBody]PolicyAccessControlInsertCommand command)
        {
            var accessControlRules = new List<AccessControlRule>();
            for (int i = 0; i < command.RuleIDs.Count; i++)
            {
                var condition = _conditionalExpressionService.Parse(command.Conditions.ElementAt(i));
                var accessControlRule = new AccessControlRule()
                {
                    Id = command.RuleIDs.ElementAt(i),
                    //Effect = command.RuleEffects.ElementAt(i),
                    Effect = "Permit",
                    Condition = condition
                };
                accessControlRules.Add(accessControlRule);
            }
            var accessControlModel = new AccessControlPolicy()
            {
                Id = ObjectId.GenerateNewId(),
                CollectionName = command.CollectionName,
                Action = command.Action,
                Description = command.Description,
                Effect = command.Effect,
                RuleCombining = command.RuleCombining,
                Rules = accessControlRules
            };
            _accessControlPolicyRepository.Add(accessControlModel);
            Console.WriteLine(command);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
