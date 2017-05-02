using AttributeBasedAC.Core.JsonAC.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Command
{

    public class PrivacyPolicyInsertCommand
    {
        //"PolicyID": this.policy_id,
        //    "CollectionName": this.collection_selected_name,
        //    "Description": this.description,
        //    "Action": this.selected_action,
        //    "Target": this.target_result,
        //    "Conditions": this.final_rule_result,
        //    "RuleIDs": this.rule_ids,
        //    "FieldEffects": this.final_field_effects
        public string PolicyID { get; set; }

        public string CollectionName { get; set; }

        public string Description { get; set; }

        public string Action { get; set; }

        public string Target { get; set; }

        public ICollection<string> Conditions { get; set; }

        public ICollection<string> RuleIDs { get; set; }

        public ICollection<FieldEffect[]> FieldEffectsArray { get; set; }
    }
}
