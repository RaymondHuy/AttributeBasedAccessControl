using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC
{
    public class RequestContext
    {
        public CollectionRequestInfo Subject { get; private set; }

        public CollectionRequestInfo Resource { get; private set; }

        public string Action { get; private set; }

        public JObject EnvironmentData { get; private set; }

        public RequestContext(CollectionRequestInfo subject, CollectionRequestInfo resource, string action, JObject environment)
        {
            Subject = subject;
            Resource = resource;
            Action = action;
            environment.AddAnnotation(Action);
            EnvironmentData = environment;
        }
    }
}
