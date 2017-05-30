using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using AttributeBasedAC.Core.JsonAC.UserDefinedFunction;
using Autofac;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator
{
    public class Program
    {
        public static IConfiguration Configuration;
        public static void Main(string[] args)
        {
            try
            {
                var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                var config = new ConfigurationBuilder()
                    .AddJsonFile($"appsettings.json", true, true)
                    .AddEnvironmentVariables();
                Configuration = config.Build();

                var mongoDbConfig = Configuration.GetSection("MongoDbConfiguration");
                var policyDb = mongoDbConfig["PolicyDb"];
                var userDb = mongoDbConfig["UserDb"];

                JsonAccessControlSetting.UserDefaultDatabaseName = userDb;
                JsonAccessControlSetting.UserDefaultCollectionName = mongoDbConfig["AccountCollection"];
                JsonAccessControlSetting.PrivacyAccessControlDbName = policyDb;

                var privacyDomainFactory = PrivacyDomainPluginFactory.GetInstance();
                privacyDomainFactory.RegisterDefaultPlugin();

                var functionFactory = UserDefinedFunctionPluginFactory.GetInstance();
                functionFactory.RegisterDefaultPlugin();

                var builder = new ContainerBuilder();
                builder.RegisterType<MongoClient>().As<IMongoClient>();

                builder.RegisterType<SubjectMongoDbRepository>().As<ISubjectRepository>();
                builder.RegisterType<ResourceMongoDbRepository>().As<IResourceRepository>();
                builder.RegisterType<AccessControlPolicyMongoDbRepository>().As<IAccessControlPolicyRepository>();
                builder.RegisterType<PrivacyDomainMongoDbRepository>().As<IPrivacyDomainRepository>();
                builder.RegisterType<PrivacyPolicyMongoDbRepository>().As<IPrivacyPolicyRepository>();

                builder.RegisterType<ConditionalExpressionService>().As<IConditionalExpressionService>();
                builder.RegisterType<AccessControlService>().As<IAccessControlService>();
                builder.RegisterType<PrivacyService>().As<IPrivacyService>();

                var container = builder.Build();

                using (var scope = container.BeginLifetimeScope())
                {
                    IMongoClient _client = new MongoClient();
                    IMongoDatabase _database = _client.GetDatabase(policyDb);
                    var expressionService = scope.Resolve<IConditionalExpressionService>();
                    AccessControlPolicyDummyData.InsertFivePoliciesForTestingPerformance(policyDb, expressionService);
                    PrivacyPolicyDummyData.InsertNestedPrivacyPolicies(policyDb, expressionService);
                }
                Console.WriteLine("Success");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());

                Console.WriteLine("Create Database Failed");
            }

        }
        private static string[] conditions = new string[] 
        {
            ""
        };
    }
}
