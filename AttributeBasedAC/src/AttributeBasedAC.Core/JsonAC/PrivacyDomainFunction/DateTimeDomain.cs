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

        public static string ShowDayAndMonth(string dateTime)
        {
            DateTime dt = DateTime.Parse(dateTime);
            return dt.Day.ToString() + "/" + dt.Month.ToString();
        }
        public static string ShowMonthAndYear(string dateTime)
        {
            DateTime dt = DateTime.Parse(dateTime);
            return dt.Month.ToString() + "/" + dt.Year.ToString();
        }
        public static string ShowYear(string dateTime)
        {
            return DateTime.Parse(dateTime).Year.ToString();
        }
    }
}
