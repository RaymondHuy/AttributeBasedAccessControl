using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    internal class PermitOverridesAlgorithm : ICombiningAlgorithm
    {
        Effect ICombiningAlgorithm.Execute(PolicySet policySet)
        {
            throw new NotImplementedException();
        }

        Effect ICombiningAlgorithm.Execute(Policy policy)
        {
            foreach (var rule in policy.Rules)
            {
                
            }
            throw new NotImplementedException();
        }
    }
}
