using AttributeBasedAC.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public class DoubleFunction : IPluginFunction
    {
        public string ClassName
        {
            get
            {
                return "Double";
            }
        }

        public MethodInfo[] RegisteredMethods
        {
            get
            {
                return typeof(DoubleFunction).GetMethods(BindingFlags.Static | BindingFlags.Public);
            }
        }
        public static bool Equal(string s1, string s2)
        {
            double n1, n2 = 0;
            bool valid = double.TryParse(s1, out n1) && double.TryParse(s2, out n2);
            if (valid)
                return n1 == n2;
            else throw new UserDefinedFunctionException("Can not execute Equal function between two parameters : " + s1 + " " + s2);
        }

        public static bool GreaterThan(string s1, string s2)
        {
            double n1, n2 = 0;
            bool valid = double.TryParse(s1, out n1) && double.TryParse(s2, out n2);
            if (valid)
                return n1 > n2;
            else throw new UserDefinedFunctionException("Can not execute GreaterThan function between two parameters : " + s1 + " " + s2);
        }

        public static bool LessThan(string s1, string s2)
        {
            double n1, n2 = 0;
            bool valid = double.TryParse(s1, out n1) && double.TryParse(s2, out n2);
            if (valid)
                return n1 < n2;
            else throw new UserDefinedFunctionException("Can not execute LessThan function between two parameters : " + s1 + " " + s2);
        }
    }
}
