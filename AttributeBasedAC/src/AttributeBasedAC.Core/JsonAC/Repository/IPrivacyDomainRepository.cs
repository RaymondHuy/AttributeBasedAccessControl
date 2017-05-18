using AttributeBasedAC.Core.JsonAC.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public interface IPrivacyDomainRepository
    {
        string ComparePrivacyFunction(string firstPrivacyFunction, string secondPrivacyFunction);

        IEnumerable<string> GetAllPrivacyFunctionName();

        IEnumerable<string> GetPrivacyFunctionNames(string fieldName);

        IEnumerable<PrivacyDomain> GetAll();

        void UpdateDomainField(string domainName, string fieldName);

        void UpdatePriorityFunctions(string domainName, ICollection<PriorityFunction> priorities);
    }
}
