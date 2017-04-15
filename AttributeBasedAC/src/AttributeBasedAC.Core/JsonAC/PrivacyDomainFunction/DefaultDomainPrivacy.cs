using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public static class DefaultDomainPrivacy
    {
        public static string Show(string s)
        {
            return s;
        }
        public static string Hide(string s)
        {
            return "";
        }

        public static string CustomFunction(string s)
        {
            return "my custom function" + s;
        }
    }
}
