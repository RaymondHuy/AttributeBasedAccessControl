using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Exceptions
{
    public class OperatorException: Exception
    {
        public OperatorException() 
            : base() { }

        public OperatorException(string message)
            : base(message) { }

        public OperatorException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
