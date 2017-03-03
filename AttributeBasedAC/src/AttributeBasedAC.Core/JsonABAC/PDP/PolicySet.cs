using AttributeBasedAC.Core.Exceptions;
using AttributeBasedAC.Core.JsonABAC;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    public class PolicySet
    {
        public ObjectId Id { get; set; }

        [BsonElement("rule_combining")]
        private string _ruleCombining { get; set; }

        [BsonElement("policy_sets")]
        public ICollection<Policy> Policies { get; set; }

        public ICombiningAlgorithm RuleCombining
        {
            get
            {
                switch (_ruleCombining)
                {
                    case "permit-overrides":
                        return new PermitOverridesAlgorithm();
                    case "deny-overrides":
                        return new DenyOverridesAlgorithm();
                    case "first-applicable":
                        return new FirstApplicableAlgorithm();
                    case "only-one-applicable":
                        return new OnlyOneApplicableAlgorithm();
                }
                throw new CombiningAlgorithmException("Unsupported combining-algorithm");
            }
            private set { }
        }
    }
}
