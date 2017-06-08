using AttributeBasedAC.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public class LogicalOperatorFunction : IPluginFunction
    {
        public string ClassName
        {
            get
            {
                return "";
            }
        }

        public MethodInfo[] RegisteredMethods
        {
            get
            {
                return typeof(LogicalOperatorFunction).GetMethods(BindingFlags.Static | BindingFlags.Public);
            }
        }

        public static bool And(string s1, string s2)
        {
            bool b1, b2 = false;
            bool valid = bool.TryParse(s1, out b1) && bool.TryParse(s2, out b2);
            if (valid)
                return (b1 == true) && (b2 == true);
            else throw new UserDefinedFunctionException("Can not execute And function between two parameters : " + s1 + " " + s2);
        }
        public static bool Or(string s1, string s2)
        {
            bool b1, b2 = false;
            bool valid = bool.TryParse(s1, out b1) && bool.TryParse(s2, out b2);
            if (valid)
                return (b1 == true) || (b2 == true);
            else throw new UserDefinedFunctionException("Can not execute Or function between two parameters : " + s1 + " " + s2);
        }

        public static bool Not(string s1)
        {
            bool b1 = false;
            bool valid = bool.TryParse(s1, out b1);
            if (valid)
                return !b1;
            else throw new UserDefinedFunctionException("Can not execute Not function of parameters : " + s1 );
        }
    }
}
