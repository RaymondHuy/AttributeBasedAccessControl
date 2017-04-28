using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Command
{
    public class AccessControlPolicyInsertCommand
    {
        public string PolicyID { get; set; }

        public string CollectionName { get; set; }

        public string Description { get; set; }

        public string Action { get; set; }

        public string RuleCombining { get; set; }

        public string Target { get; set; }

        public ICollection<string> Conditions { get; set; }

        public ICollection<string> RuleIDs { get; set; }

        public ICollection<string> RuleEffects { get; set; }
    }
}
