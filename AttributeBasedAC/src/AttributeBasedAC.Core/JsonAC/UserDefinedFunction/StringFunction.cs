using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public class StringFunction : IPluginFunction
    {
        public string ClassName
        {
            get
            {
                return "String";
            }
        }

        public MethodInfo[] RegisteredMethods
        {
            get
            {
                return typeof(StringFunction).GetMethods(BindingFlags.Static | BindingFlags.Public);
            }
        }

        public static bool Equal(string s1, string s2)
        {
            return s1 == s2 ? true : false;
        }
    }
}
