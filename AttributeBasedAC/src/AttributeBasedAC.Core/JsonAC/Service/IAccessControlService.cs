using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public interface IAccessControlService
    {
        ResponseContext GetDataForSubject(RequestContext requestContext);
    }
}
