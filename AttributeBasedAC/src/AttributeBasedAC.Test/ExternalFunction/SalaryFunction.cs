using AttributeBasedAC.Core.JsonAC.UserDefinedFunction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Test.ExternalFunction
{
    public class SalaryFunction : IPluginFunction
    {
        public string ClassName
        {
            get
            {
                return "Salary";
            }
        }

        public MethodInfo[] RegisteredMethods
        {
            get
            {
                return typeof(SalaryFunction).GetMethods(BindingFlags.Static | BindingFlags.Public);
            }
        }

        public static void Hello(string s1, string s2)
        {
            Console.WriteLine(s1);
        }
    }
}
