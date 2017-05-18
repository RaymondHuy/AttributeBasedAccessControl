using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Command
{
    public class PrivacyDomainFieldUpdateCommand
    {
        public string DomainName { get; set; }

        public string FieldName { get; set; }
    }
}
