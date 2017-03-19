using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class EnvironmentRepository : IEnvironmentRepository
    {
        private JObject _environmentData;

        string IEnvironmentRepository.GetValue(string key)
        {
            return _environmentData.Value<string>(key);
        }

        void IEnvironmentRepository.SetEnvironmentData(JObject data)
        {
            _environmentData = data;
        }
    }
}
