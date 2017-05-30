using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.UserDefinedFunction
{
    public class UserDefinedFunctionPluginFactory
    {
        private UserDefinedFunctionPluginFactory() { }

        private static UserDefinedFunctionPluginFactory _instance = new UserDefinedFunctionPluginFactory();

        public static UserDefinedFunctionPluginFactory GetInstance()
        {
            return _instance;
        }

        private SortedList<string, MethodInfo> _container = new SortedList<string, MethodInfo>();

        public void RegisterDefaultPlugin()
        {
            RegisterPlugin(typeof(StringFunction));
            RegisterPlugin(typeof(BooleanFunction));
            RegisterPlugin(typeof(IntegerFunction));
            RegisterPlugin(typeof(DoubleFunction));
            RegisterPlugin(typeof(DateTimeFunction));
            RegisterPlugin(typeof(LogicalOperatorFunction));
        }

        public void RegisterPlugin(Type plugin)
        {
            if (typeof(IPluginFunction).IsAssignableFrom(plugin))
            {
                var type = (IPluginFunction)Activator.CreateInstance(plugin);
                foreach (var func in type.RegisteredMethods)
                {
                    var name = type.ClassName + func.Name;
                    _container.Add(name, func);
                }
            }
        }

        public IEnumerable<string> GetAllRegisteredFunction()
        {
            return _container.Select(f => f.Key).ToList();
        }

        public MethodInfo GetFunction(string functionName)
        {
            return _container.ContainsKey(functionName) ? _container[functionName] : null;
        }
    }
}
