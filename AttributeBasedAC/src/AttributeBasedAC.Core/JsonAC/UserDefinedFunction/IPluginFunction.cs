using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public interface IPluginFunction
    {
        string ClassName { get; }

        MethodInfo[] RegisteredMethods { get; }
    }
}
