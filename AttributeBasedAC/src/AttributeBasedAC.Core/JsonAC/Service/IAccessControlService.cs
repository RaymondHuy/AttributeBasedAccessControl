﻿using AttributeBasedAC.Core.JsonAC.Model;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public interface IAccessControlService
    {
        ResponseContext ExecuteProcess(JObject user, JObject[] resource, string action, string collectionName, JObject environment);

        ICollection<AccessControlPolicy> Review(JObject user, JObject resource, JObject environment);

    }
}
