using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC
{
    public enum EffectResult
    {
        Permit = 0,
        Deny = 1,
        NotApplicable = 2
    }

    public class ResponseContext
    {
        public EffectResult Effect { get; set; }

        public ICollection<JObject> Data { get; set; }

        public ResponseContext(EffectResult effect, ICollection<JObject> data)
        {
            Effect = effect;
            Data = data;
        }
    }
}
