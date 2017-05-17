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
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");


            var builder = new ConfigurationBuilder()
                .AddJsonFile($"appsettings.json", true, true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            var mongoDbConfig = Configuration.GetSection("MongoDbConfiguration");
            var policyDb = mongoDbConfig["PolicyDb"];

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCombiningCollection = _database.GetCollection<AccessControlPolicyCombining>("AccessControlPolicyCombining");
            acPolicyCombiningCollection.InsertOne(new AccessControlPolicyCombining());
            acPolicyCombiningCollection.DeleteMany(_ => true);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");
            acPolicyCollection.InsertOne(new AccessControlPolicy());
            acPolicyCollection.DeleteMany(_ => true);

            var pPolicyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicyPolicy");
            pPolicyCollection.InsertOne(new PrivacyPolicy());
            pPolicyCollection.DeleteMany(_ => true);


            var domainPrivacyCollection = _database.GetCollection<PrivacyDomain>("PrivacyDomain");
            domainPrivacyCollection.InsertOne(
                new PrivacyDomain
                {
                    DomainName = "DefaultDomainPrivacy",
                    Fields = new string[0],
                    IsArrayFieldDomain = false,
                    Functions = new PriorityFunction[2] { new PriorityFunction { Name = "Hide", Priority = 1 }, new PriorityFunction { Name = "Show", Priority = 2 } }
                });

            Console.WriteLine("Create Database successfully");
        }
    }
}
