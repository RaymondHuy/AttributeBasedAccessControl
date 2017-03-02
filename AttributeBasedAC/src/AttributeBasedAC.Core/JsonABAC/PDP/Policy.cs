﻿using AttributeBasedAC.Core.Exceptions;
using AttributeBasedAC.Core.JsonABAC.PDP.Algorithms;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    [BsonIgnoreExtraElements]
    public class Policy
    {
        [BsonElement("target")]
        public Target Target { get; set; }

        [BsonElement("policy_id")]
        public string PolicyId { get; set; }

        [BsonElement("rule_combining")]
        private string _ruleCombining { get; set; }

        [BsonElement("rules")]
        public List<Rule> Rules { get; set; }

        public ICombiningAlgorithm RuleCombining {
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

        public bool IsPermit()
        {
            return true;
        }
    }
}
