using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Infrastructure
{
    public class UserDefinedFunctionException : Exception
    {
        public UserDefinedFunctionException() 
            : base() { }

        public UserDefinedFunctionException(string message)
            : base(message) { }

        public UserDefinedFunctionException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
