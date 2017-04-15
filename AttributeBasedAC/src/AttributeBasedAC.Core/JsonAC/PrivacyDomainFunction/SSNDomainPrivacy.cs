using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public static class SSNDomainPrivacy
    {
        public static string AreaNumber(string ssn)
        {
            return ssn.Split('-')[0];
        }
        public static string GroupNumber(string ssn)
        {
            return ssn.Split('-')[1];
        }
        public static string SerialNumber(string ssn)
        {
            return ssn.Split('-')[2];
        }
    }
}
