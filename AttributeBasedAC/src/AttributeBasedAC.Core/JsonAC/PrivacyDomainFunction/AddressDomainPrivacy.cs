using AttributeBasedAC.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public class AddressDomainPrivacy : IPluginDomain
    {
        public string Name
        {
            get
            {
                return "AddressDomainPrivacy";
            }
        }

        public static string ShowStreetNumber(string s)
        {
            string[] arr = s.Split(',');
            if (arr.Length > 0)
                return arr[0];
            else throw new PrivacyDomainException();
        }

        public static string ShowStreetName(string s)
        {
            string[] arr = s.Split(',');
            if (arr.Length > 1)
                return arr[1];
            else throw new PrivacyDomainException();
        }

        public static string ShowDistrictNumber(string s)
        {
            string[] arr = s.Split(',');
            if (arr.Length > 2)
                return arr[2];
            else throw new PrivacyDomainException();
        }
    }
}
