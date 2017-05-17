using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Infrastructure
{
    public class PrivacyDomainException : Exception
    {
        public PrivacyDomainException() 
            : base() { }

        public PrivacyDomainException(string message)
            : base(message) { }

        public PrivacyDomainException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
