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

        public JArray Data { get; set; }

        public ICollection<JObject> JsonObjects { get; set; }

        public string Message { get; set; }

        public ResponseContext(EffectResult effect, JArray data, string message = null)
        {
            Effect = effect;
            Data = data;
            Message = message;
        }
        public ResponseContext(EffectResult effect, ICollection<JObject> data)
        {
            Effect = effect;
            JsonObjects = data;
        }
    }
}
