using AttributeBasedAC.Core.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public class BooleanFunction : IPluginFunction
    {
        public string ClassName
        {
            get
            {
                return "Boolean";
            }
        }

        public MethodInfo[] RegisteredMethods
        {
            get
            {
                return typeof(BooleanFunction).GetMethods(BindingFlags.Static | BindingFlags.Public);
            }
        }

        public static bool Equal(string s1, string s2)
        {
            bool b1, b2 = false;
            bool valid = bool.TryParse(s1, out b1) && bool.TryParse(s2, out b2);
            if (valid)
                return b1 == b2;
            else throw new UserDefinedFunctionException("Can not execute Equal function between two parameters : " + s1 + " " + s2);
        }
    }
}
