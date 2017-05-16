using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Infrastructure
{
    public class ConditionalExpressionException : Exception
    {
        public ConditionalExpressionException() 
            : base() { }

        public ConditionalExpressionException(string message)
            : base(message) { }

        public ConditionalExpressionException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
