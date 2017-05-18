using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using MongoDB.Driver;
using AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction;
using AttributeBasedAC.Core.JsonAC.Infrastructure;
using AttributeBasedAC.Core.JsonAC.UserDefinedFunction;
using AttributeBasedAC.WebAPI.Middlewares;

namespace AttributeBasedAC.WebAPI
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();

            var mongoDbConfig = Configuration.GetSection("MongoDbConfiguration");
            var policyDb = mongoDbConfig["PolicyDb"];
            var userDb = mongoDbConfig["UserDb"];

            JsonAccessControlSetting.UserDefaultDatabaseName = userDb;
            JsonAccessControlSetting.UserDefaultCollectionName = mongoDbConfig["AccountCollection"];
            JsonAccessControlSetting.PrivacyAccessControlDbName = policyDb;
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();
            services.AddScoped<IMongoClient, MongoClient>();

            services.AddScoped<ISubjectRepository, SubjectMongoDbRepository>();
            services.AddScoped<IAccessControlPolicyRepository, AccessControlPolicyMongoDbRepository>();
            services.AddScoped<IResourceRepository, ResourceMongoDbRepository>();
            services.AddScoped<IPrivacyDomainRepository, PrivacyDomainMongoDbRepository>();
            services.AddScoped<IAccessControlPolicyRepository, AccessControlPolicyMongoDbRepository>();
            services.AddScoped<IPrivacyPolicyRepository, PrivacyPolicyMongoDbRepository>();

            services.AddScoped<IConditionalExpressionService, ConditionalExpressionService>();
            services.AddScoped<IAccessControlService, AccessControlService>();
            services.AddScoped<IPrivacyService, PrivacyService>();
            services.AddScoped<ISecurityService, SecurityService>();

            var privacyDomainFactory = PrivacyDomainPluginFactory.GetInstance();
            privacyDomainFactory.RegisterDefaultPlugin();

            var functionFactory = UserDefinedFunctionPluginFactory.GetInstance();
            functionFactory.RegisterDefaultPlugin();

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            app.UseCors("CorsPolicy");
            app.UseMiddleware(typeof(ErrorHandlingMiddleware));
            app.UseMvc();
        }
    }
}
