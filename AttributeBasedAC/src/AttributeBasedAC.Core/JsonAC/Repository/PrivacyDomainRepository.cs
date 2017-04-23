using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class PrivacyDomainRepository : IPrivacyDomainRepository
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<PrivacyDomain> _mongoCollection;
        public PrivacyDomainRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _mongoCollection = _mongoClient.GetDatabase(JsonAccessControlSetting.PrivacyAccessControlDbName)
                                        .GetCollection<PrivacyDomain>("PrivacyDomain");
        }

        string IPrivacyDomainRepository.ComparePrivacyFunction(string firstPrivacyFunction, string secondPrivacyFunction)
        {
            string domainName = firstPrivacyFunction.Split('.')[0];
            string firstPrivacyFunctionName = firstPrivacyFunction.Split('.')[1];
            string secondPrivacyFunctionName = secondPrivacyFunction.Split('.')[1];

            var privacyDomain = _mongoCollection.Find(f => f.DomainName.Equals(domainName)).FirstOrDefault();
            int priority1 = privacyDomain.Functions.Where(f => f.Name.Equals(firstPrivacyFunctionName)).FirstOrDefault().Priority;
            int priority2 = privacyDomain.Functions.Where(f => f.Name.Equals(secondPrivacyFunctionName)).FirstOrDefault().Priority;

            if (priority1 > priority2)
                return firstPrivacyFunction;
            else return secondPrivacyFunction;
        }

        IEnumerable<string> IPrivacyDomainRepository.GetAllPrivacyFunctionName()
        {
            var result = new List<string>();
            var domains = _mongoCollection.Find(_ => true).ToList();
            foreach (var domain in domains)
            {
                foreach (var function in domain.Functions)
                {
                    result.Add(domain.DomainName + "." + function.Name);
                }
            }
            return result;
        }
    }
}
