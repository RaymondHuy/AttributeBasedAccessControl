using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public class PhoneDomainPrivacy : IPluginDomain
    {
        public string Name
        {
            get
            {
                return "PhoneDomain";
            }
        }

        public static string FirstThreeDigits(string s)
        {
            if (s.Length > 3)
                return s.Substring(0, 3);
            else return s;
        }

        public static string LastThreeDigits(string s)
        {
            if (s.Length > 3)
                return s.Substring(s.Length - 3, 3);
            else return s;
        }
    }
}
