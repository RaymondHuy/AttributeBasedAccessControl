using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class PrivacyFunctionRepository : IPrivacyFunctionRepository
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<PrivacyDomain> _mongoCollection;
        public PrivacyFunctionRepository(IMongoClient mongoClient)
        {
            _mongoClient = mongoClient;
            _mongoCollection = _mongoClient.GetDatabase(JsonAccessControlSetting.AccessControlDatabaseName)
                                        .GetCollection<PrivacyDomain>("PrivacyFunction");
        }

        string IPrivacyFunctionRepository.ComparePrivacyFunction(string firstPrivacyFunction, string secondPrivacyFunction)
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
    }
}
