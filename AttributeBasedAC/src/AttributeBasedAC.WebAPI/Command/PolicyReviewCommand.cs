using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Command
{
    public class PolicyReviewCommand
    {
        public string UserJsonData { get; set; }

        public string ResourceJsonData { get; set; }

        public string EnvironmentJsonData { get; set; }

        public string Action { get; set; }

        public string CollectionName { get; set; }
    }
}
