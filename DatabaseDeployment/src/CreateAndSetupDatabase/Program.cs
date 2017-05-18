using CreateAndSetupDatabase.UserDefaultDatabase;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    public class Program
    {
        public static IConfiguration Configuration;
        public static void Main(string[] args)
        {
            try
            {
                var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                var builder = new ConfigurationBuilder()
                    .AddJsonFile($"appsettings.json", true, true)
                    .AddEnvironmentVariables();
                Configuration = builder.Build();

                var mongoDbConfig = Configuration.GetSection("MongoDbConfiguration");
                var policyDb = mongoDbConfig["PolicyDb"];
                var userDb = mongoDbConfig["UserDb"];

                IMongoClient _client = new MongoClient();
                IMongoDatabase _database = _client.GetDatabase(policyDb);

                var acPolicyCombiningCollection = _database.GetCollection<AccessControlPolicyCombining>("AccessControlPolicyCombining");
                acPolicyCombiningCollection.InsertOne(new AccessControlPolicyCombining());
                acPolicyCombiningCollection.DeleteMany(_ => true);

                Console.WriteLine("Creating Access Control Policy Collection");
                AccessControlPolicyRepository.InsertDummyData(policyDb);
                Console.WriteLine("Created Access Control Policy Collection\n");

                Console.WriteLine("Creating Privacy Policy Collection");
                PrivacyPolicyRepository.InsertDummyData(policyDb);
                Console.WriteLine("Created Privacy Policy Collection\n");

                Console.WriteLine("Creating Department Collection");
                DepartmentRepository.InsertDummyData(userDb);
                Console.WriteLine("Created Department Collection\n");

                Console.WriteLine("Creating User Collection");
                UserRepository.InsertDummyData(userDb);
                Console.WriteLine("Created User Collection\n");

                var domainPrivacyCollection = _database.GetCollection<PrivacyDomain>("PrivacyDomain");
                InsertPrivactDomainData(domainPrivacyCollection);
                Console.WriteLine("Create Database successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

                Console.WriteLine("Create Database Failed");
            }

        }
        private static void InsertPrivactDomainData(IMongoCollection<PrivacyDomain> domainPrivacyCollection)
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
                    Fields = new string[] { "Department.date_created", "Departmentleader.info.date_of_birth" },
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
    }
}
