﻿using AttributeBasedAC.Core.JsonAC.Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public interface IExpressionService
    {
        bool Evaluate(Function function, JObject user, JObject resource, JObject environment);
    }
}
