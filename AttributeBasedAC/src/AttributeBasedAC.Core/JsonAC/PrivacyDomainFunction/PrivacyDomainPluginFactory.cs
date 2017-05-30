using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public class PrivacyDomainPluginFactory
    {
        private PrivacyDomainPluginFactory() { }

        private static PrivacyDomainPluginFactory _instance = new PrivacyDomainPluginFactory();

        public static PrivacyDomainPluginFactory GetInstance()
        {
            return _instance;
        }

        private SortedList<string, Type> _container = new SortedList<string, Type>();

        public void RegisterDefaultPlugin()
        {
            _container.Add("DateTimeDomain", typeof(DateTimeDomain));
            _container.Add("DefaultDomainPrivacy", typeof(DefaultDomainPrivacy));
            _container.Add("SSNDomainPrivacy", typeof(SSNDomainPrivacy));
            _container.Add("PhoneDomain", typeof(PhoneDomainPrivacy));
            _container.Add("AddressDomainPrivacy", typeof(AddressDomainPrivacy));
        }
        public void RegisterPlugin(Type plugin)
        {
            if (typeof(IPluginDomain).IsAssignableFrom(plugin))
            {
                var type = (IPluginDomain)Activator.CreateInstance(plugin);
                _container.Add(type.Name, plugin);
            }
        }

        public Type GetDomainType(string name)
        {
            return _container[name];
        }

        public ICollection<string> GetAllDomainType()
        {
            return _container.Select(n => n.Key).ToList();
        }
    }
}
