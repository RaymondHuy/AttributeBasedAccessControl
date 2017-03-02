using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC.PDP.Algorithms
{
    public class OnlyOneApplicableAlgorithm : ICombiningAlgorithm
    {
        Effect ICombiningAlgorithm.Execute(PolicySet policySet)
        {
            throw new NotImplementedException();
        }

        Effect ICombiningAlgorithm.Execute(Policy policy)
        {
            throw new NotImplementedException();
        }
    }
}
