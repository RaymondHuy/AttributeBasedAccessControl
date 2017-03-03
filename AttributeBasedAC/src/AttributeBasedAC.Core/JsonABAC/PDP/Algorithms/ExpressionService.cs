using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    internal class ExpressionService : IExpressionService
    {
        private readonly IResourceRepository _resourceRepository;
        private readonly ISubjectRepository _subjectRepository;

        public ExpressionService()
        {
        }

        bool IExpressionService.Evaluate(Expression expression)
        {
            bool result = false;
            if (expression.Operator == Operator.AND)
            {
                result = true;
                foreach (Clause clause in expression.Clauses)
                {
                    result &= true;
                    if (result == false) break;
                }
            }
            else if (expression.Operator == Operator.OR)
            {
                result = false;
                foreach (Clause clause in expression.Clauses)
                {
                    result |= false;
                    if (result == true) break;
                }
            }
            return result;
        }
    }
}
