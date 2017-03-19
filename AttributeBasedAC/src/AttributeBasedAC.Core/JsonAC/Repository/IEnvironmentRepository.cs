using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public interface IEnvironmentRepository
    {
        string GetValue(string key);

        void SetEnvironmentData(JObject data);
    }
}
