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

        public static string ShowDay(string dateTime)
        {
            return DateTime.Parse(dateTime).Day.ToString();
        }
        public static string ShowMonth(string dateTime)
        {
            return DateTime.Parse(dateTime).Month.ToString();
        }
        public static string ShowYear(string dateTime)
        {
            return DateTime.Parse(dateTime).Year.ToString();
        }
    }
}
