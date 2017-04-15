using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Command
{
    public class PrivacyCheckingCommand
    {
        public string UserID { get; set; }

        public string ResourceName { get; set; }

        public string ResourceCondition { get; set; }

        public string Environment { get; set; }
    }
}
