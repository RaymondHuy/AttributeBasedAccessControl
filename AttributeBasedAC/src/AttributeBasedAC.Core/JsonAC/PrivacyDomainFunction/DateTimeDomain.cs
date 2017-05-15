using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public class DateTimeDomain : IPluginDomain
    {
        public string Name
        {
            get
            {
                return "DateTimeDomain";
            }
        }

        public static string Day(string dateTime)
        {
            return DateTime.Parse(dateTime).Day.ToString();
        }
    }
}
