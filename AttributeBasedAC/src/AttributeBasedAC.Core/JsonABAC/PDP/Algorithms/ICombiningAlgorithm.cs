using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC.PDP.Algorithms
{
    public interface ICombiningAlgorithm
    {
        Effect Execute(Policy policy);

        Effect Execute(PolicySet policySet);
    }
}
