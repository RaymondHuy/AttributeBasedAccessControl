using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public class PrivacyDomainMongoDbRepository : IPrivacyDomainRepository
    {
        private readonly IMongoClient _mongoClient;
        private readonly IMongoCollection<PrivacyDomain> _mongoCollection;
        public PrivacyDomainMongoDbRepository(IMongoClient mongoClient)
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

        IEnumerable<PrivacyDomain> IPrivacyDomainRepository.GetAll()
        {
            return _mongoCollection.Find(_ => true).ToList();         
        }

        IEnumerable<string> IPrivacyDomainRepository.GetPrivacyFunctionNames(string fieldName)
        {
            var result = new List<string>();
            var builder = Builders<PrivacyDomain>.Filter;
            var filter = builder.In("fields", fieldName);
            result.Add("Optional");
            var domains = _mongoCollection.Find(_ => true).ToList();
            foreach (var domain in domains)
            {
                if (domain.Fields.Contains(fieldName))
                    foreach (var function in domain.Functions)
                    {
                        result.Add(domain.DomainName + "." + function.Name);
                    }
            }
            result.Add("DefaultDomainPrivacy.Show");
            result.Add("DefaultDomainPrivacy.Hide");
            return result;
        }

        void IPrivacyDomainRepository.UpdateDomainField(string domainName, string fieldName)
        {
            var filter = Builders<PrivacyDomain>.Filter.Eq("domain_name", domainName);
            var update = Builders<PrivacyDomain>.Update.AddToSet("fields", fieldName);
            _mongoCollection.UpdateOne(filter, update);
        }

        void IPrivacyDomainRepository.UpdatePriorityFunctions(string domainName, ICollection<PriorityFunction> priorities)
        {
            var filter = Builders<PrivacyDomain>.Filter.Eq("domain_name", domainName);
            var update = Builders<PrivacyDomain>.Update.Set("hierarchy", priorities);
            _mongoCollection.UpdateOne(filter, update);
        }

        void IPrivacyDomainRepository.InsertDomain(PrivacyDomain domain)
        {
            _mongoCollection.InsertOne(domain);
            return;
        }
    }
}
