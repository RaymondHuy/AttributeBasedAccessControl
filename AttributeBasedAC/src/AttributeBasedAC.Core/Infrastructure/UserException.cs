﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.Infrastructure
{
    public class UserException : Exception
    {
        public UserException() 
            : base() { }

        public UserException(string message)
            : base(message) { }

        public UserException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
