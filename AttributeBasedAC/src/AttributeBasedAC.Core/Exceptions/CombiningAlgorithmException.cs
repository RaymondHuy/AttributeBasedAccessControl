using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Exceptions
{
    public class CombiningAlgorithmException : Exception
    {
        public CombiningAlgorithmException() 
            : base() { }

        public CombiningAlgorithmException(string message)
            : base(message) { }

        public CombiningAlgorithmException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
