using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase
{
    [BsonIgnoreExtraElements]
    public class PrivacyPolicy
    {
        [BsonElement("collection_name")]
        public string CollectionName { get; set; }

        [BsonElement("policy_id")]
        public string PolicyId { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("target")]
        [BsonIgnoreIfNull]
        public Function Target { get; set; }

        [BsonElement("is_attribute_resource_required")]
        public bool IsAttributeResourceRequired { get; set; }

        [BsonElement("rules")]
        public ICollection<FieldRule> Rules { get; set; }

    }

    public static class PrivacyPolicyRepository
    {
        public static void InsertDummyData(string policyDb)
        {
            var data = new List<PrivacyPolicy>();
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 01",
                Target = new Function { FunctionName = "StringEqual", Parameters = new List<Function> { new Function { ResourceID = "Subject", Value = "role" }, new Function { ResourceID = null, Value = "Admin" } } },
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "Rule 1",
                        Condition = new Function { FunctionName = "StringEqual", Parameters = new List<Function> { new Function { ResourceID = "Environment", Value = "purpose" }, new Function { ResourceID = null, Value = "analysis" } } },
                        FieldEffects = new List<FieldEffect> {
                            new FieldEffect { Name = "dept_id", FunctionApply = "DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name = "date_created", FunctionApply="DateTimeDomain.ShowYear"},
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Hide"},
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Hide"},
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name="technologies", FunctionApply = "DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply = "DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name="leader.info.phone", FunctionApply = "DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name="leader.info.ssn", FunctionApply = "DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DateTimeDomain.ShowYear"},
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide"},
                            new FieldEffect { Name="dept_no", FunctionApply = "DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="location", FunctionApply = "DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="projects", FunctionApply="DepartmentProjects.policy02"}
                        }
                    }
                }
            });
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department.projects",
                Description = "",
                IsAttributeResourceRequired = true,
                PolicyId = "policy02",
                Target = null,
                Rules = new List<FieldRule> {
                    new FieldRule {
                        Identifer = "Rule 1",
                        Condition = new Function { FunctionName = "StringEqual", Parameters = new List<Function> { new Function { ResourceID = "Resource", Value = "language" }, new Function { ResourceID = null, Value = "English" } } },
                        FieldEffects = new List<FieldEffect>() {
                            new FieldEffect { Name = "name", FunctionApply = "DefaultDomainPrivacy.Hide"},
                            new FieldEffect { Name = "language", FunctionApply="DefaultDomainPrivacy.Show"}
                        }
                    },
                    new FieldRule {
                        Identifer = "Rule 2",
                        Condition = new Function { FunctionName = "StringEqual", Parameters = new List<Function> { new Function { ResourceID = "Resource", Value = "language" }, new Function { ResourceID = null, Value = "Chinese" } } },
                        FieldEffects = new List<FieldEffect>() {
                            new FieldEffect { Name = "name", FunctionApply = "DefaultDomainPrivacy.Show"},
                            new FieldEffect { Name = "language", FunctionApply="DefaultDomainPrivacy.Show"}
                        }
                    }
                }
            });
            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");
            acPolicyCollection.InsertMany(data);
        }
    }
}
