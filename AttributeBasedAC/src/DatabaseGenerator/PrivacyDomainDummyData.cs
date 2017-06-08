using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Service;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator
{
    public class PrivacyDomainDummyData
    {
        private static void InsertPrivacyDomainData(IMongoCollection<PrivacyDomain> domainPrivacyCollection)
        {
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "DefaultDomainPrivacy",
                    Fields = new string[0],
                    IsArrayFieldDomain = false,
                    Functions = new PriorityFunction[2] { new PriorityFunction { Name = "Hide", Priority = 2 }, new PriorityFunction { Name = "Show", Priority = 1 } }
                });
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "DateTimeDomain",
                    Fields = new string[] { "Department.date_created", "Department.leader.info.date_of_birth" },
                    IsArrayFieldDomain = false,
                    Functions = new PriorityFunction[3] { new PriorityFunction { Name = "ShowDayAndMonth", Priority = 1 }, new PriorityFunction { Name = "ShowMonthAndYear", Priority = 2 }, new PriorityFunction { Name = "ShowYear", Priority = 3 } }
                });
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "SSNDomainPrivacy",
                    Fields = new string[] { "Department.leader.info.ssn" },
                    IsArrayFieldDomain = false,
                    Functions = new PriorityFunction[3] { new PriorityFunction { Name = "AreaNumber", Priority = 1 }, new PriorityFunction { Name = "GroupNumber", Priority = 2 }, new PriorityFunction { Name = "SerialNumber", Priority = 3 } }
                });
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "PhoneDomain",
                    Fields = new string[] { "Department.leader.info.phone", "User.phone" },
                    IsArrayFieldDomain = false,
                    Functions = new PriorityFunction[2] { new PriorityFunction { Name = "FirstThreeDigits", Priority = 1 }, new PriorityFunction { Name = "LastThreeDigits", Priority = 2 } }
                });
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "DepartmentProjects",
                    Fields = new string[] { "Department.projects" },
                    IsArrayFieldDomain = true,
                    Functions = new PriorityFunction[1] { new PriorityFunction { Name = "policy02", Priority = 1 } }
                });
        }

        public static void InsertPrivacyDomainForDemo(string policyDb, IConditionalExpressionService expression)
        {
            var data = new List<PrivacyDomain>();
            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var privacyCollection = _database.GetCollection<PrivacyDomain>("PrivacyDomain");
            data.Add(new PrivacyDomain()
            {
                DomainName = "DepartmentProjects",
                Fields = new string[1] { "Department.projects" },
                IsArrayFieldDomain = true,
                Functions = new PriorityFunction[1] { new PriorityFunction() { Name = "Policy3", Priority = 1 } }
            });

            data.Add(new PrivacyDomain()
            {
                DomainName = "DefaultDomainPrivacy",
                Fields = new string[0] { },
                IsArrayFieldDomain = false,
                Functions = new PriorityFunction[2] { new PriorityFunction() { Name = "Hide", Priority = 1 }, new PriorityFunction() { Name = "Show", Priority = 2 } }
            });

            data.Add(new PrivacyDomain()
            {
                DomainName = "PhoneDomain",
                Fields = new string[1] { "Department.leader.phone" },
                IsArrayFieldDomain = false,
                Functions = new PriorityFunction[2] { new PriorityFunction() { Name = "FirstThreeDigits", Priority = 1 }, new PriorityFunction() { Name = "LastThreeDigits", Priority = 2 } }
            });

            data.Add(new PrivacyDomain()
            {
                DomainName = "DateTimeDomain",
                Fields = new string[1] { "User.date_of_birth" },
                IsArrayFieldDomain = false,
                Functions = new PriorityFunction[3] {
                    new PriorityFunction() { Name = "ShowDayAndMonth", Priority = 1 },
                    new PriorityFunction() { Name = "ShowMonthAndYear", Priority = 2 },
                    new PriorityFunction() { Name = "ShowYear", Priority = 3 }
                }
            });
            data.Add(new PrivacyDomain()
            {
                DomainName = "SSNDomainPrivacy",
                Fields = new string[1] { "User.ssn" },
                IsArrayFieldDomain = false,
                Functions = new PriorityFunction[3] {
                    new PriorityFunction() { Name = "AreaNumber", Priority = 1 },
                    new PriorityFunction() { Name = "GroupNumber", Priority = 2 },
                    new PriorityFunction() { Name = "SerialNumber", Priority = 3 }
                }
            });
            data.Add(new PrivacyDomain()
            {
                DomainName = "AddressDomainPrivacy",
                Fields = new string[2] { "User.address", "Department.address" },
                IsArrayFieldDomain = false,
                Functions = new PriorityFunction[3] {
                    new PriorityFunction() { Name = "ShowStreetNumber", Priority = 1 },
                    new PriorityFunction() { Name = "ShowStreetName", Priority = 2 },
                    new PriorityFunction() { Name = "ShowDistrictNumber", Priority = 3 }
                }
            });
            privacyCollection.InsertMany(data);
        }
    }
}
