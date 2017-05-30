using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Repository;
using AttributeBasedAC.Core.JsonAC.Service;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator
{
    public class PrivacyPolicyDummyData
    {
        public static void Insert(string policyDB, IConditionalExpressionService expression)
        {
            var data = new List<PrivacyPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDB);

            var privacyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");

            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) } }
            });
            privacyCollection.InsertManyAsync(data);
        }

        public static string[] Targets = new string[]
        {
            "BooleanEqual ( Subject.active , 'true' ) AND StringEqual ( Subject.department_name , Resource.name ) AND BooleanEqual ( Resource.is_deleted , 'false' )",
            "StringEqual ( Subject.department_name , Resource.name ) AND StringEqual ( Subject.location , Resource.location )",
            "StringEqual ( Subject.gender , 'Female' ) AND IntegerGreaterThan ( Subject.age , '25' )"

        };

        public static string[] Rules = new string[]
        {
            "BooleanEqual ( Subject.active , 'true' ) AND StringEqual ( Subject.department_name , Resource.name ) AND BooleanEqual ( Resource.is_deleted , 'false' )",
            "StringEqual ( Subject.department_name , Resource.name ) AND StringEqual ( Subject.location , Resource.location )",
            "StringEqual ( Subject.gender , 'Female' ) AND IntegerGreaterThan ( Subject.age , '25' )"
        };

        public static void InsertFivePoliciesForTesting(string policyDB, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "BooleanEqual ( Subject.active , 'true' )"
            };
            string[] Rules = new string[]
            {
                "IntegerGreaterThan ( Resource.number_developers , '15' ) AND IntegerGreaterThan ( Subject.age , '15' ) AND DateGreaterThan ( Resource.leader.info.date_of_birth , '1/1/1995' )"
            };

            var data = new List<PrivacyPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDB);

            var privacyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");
            #region add data
            for (int i = 1; i <= 4; i++)
            {
                data.Add(new PrivacyPolicy
                {
                    CollectionName = "Department",
                    Description = "....",
                    IsAttributeResourceRequired = true,
                    PolicyId = "policy 1",
                    Target = expression.Parse(Targets[0]),
                    Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 3",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                }
                });
            }
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 3",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                }

            });

            #endregion
            privacyCollection.InsertManyAsync(data);
        }
        public static void InsertNestedPrivacyPolicies(string policyDB, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "StringEqual ( Subject.role , 'intern' )"
            };
            string[] Rules = new string[]
            {
                "StringEqual ( Environment.purpose , 'analysis' )",
                "StringEqual ( Resource.dept_name , 'OPERATIONS' )"
            };
            var data = new List<PrivacyPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDB);

            var privacyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");
            for (int i = 1; i <= 4; i++)
            {
                data.Add(new PrivacyPolicy
                {
                    CollectionName = "Department",
                    Description = "....",
                    IsAttributeResourceRequired = true,
                    PolicyId = "policy 1",
                    Target = expression.Parse(Targets[0]),
                    Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="developers", FunctionApply="Department.policy8" }
                        },
                        Condition = expression.Parse(Rules[2]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="developers", FunctionApply="Department.policy8" }
                        },
                        Condition = expression.Parse(Rules[2]) },
                    new FieldRule {
                        Identifer = "rule 3",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="developers", FunctionApply="Department.policy8" }
                        },
                        Condition = expression.Parse(Rules[2]) },
                }
                });
            }
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="developers", FunctionApply="Department.policy8" }
                        },
                        Condition = expression.Parse(Rules[3]) }
                }

            });
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department.developers",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy8",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                        new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="info.ssn", FunctionApply="SSNDomainPrivacy.AreaNumber" },
                            new FieldEffect { Name="info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="info.phone", FunctionApply="PhoneDomain.LastThreeDigits" },
                        },
                        Condition = expression.Parse(Rules[0]) },
                        new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="info.ssn", FunctionApply="SSNDomainPrivacy.GroupNumber" },
                            new FieldEffect { Name="info.salary", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="info.phone", FunctionApply="PhoneDomain.LastThreeDigits" },
                        },
                        Condition = expression.Parse(Rules[1]) },
                }
            });

            privacyCollection.InsertManyAsync(data);
        }
        public static void InsertTenPoliciesForTesting(string policyDB, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "BooleanEqual ( Subject.active , 'true' )"
            };
            string[] Rules = new string[]
            {
                "DoubleLessThan ( Resource.tax , 1000 ) AND IntegerGreaterThan ( Resource.dept_no , '0' ) AND IntegerGreaterThan ( Resource.number_developers , '15' ) AND IntegerGreaterThan ( Subject.age , '15' ) AND DateGreaterThan ( Resource.leader.info.date_of_birth , '1/1/1995' )"
            };

            var data = new List<PrivacyPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDB);

            var privacyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");
            #region add data
            for (int i = 1; i <= 6; i++)
            {
                data.Add(new PrivacyPolicy
                {
                    CollectionName = "Department",
                    Description = "....",
                    IsAttributeResourceRequired = true,
                    PolicyId = "policy 1",
                    Target = expression.Parse(Targets[0]),
                    Rules = new FieldRule[] {
                        new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                        new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 3",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                }
                });
            }
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                    new FieldRule {
                        Identifer = "rule 3",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="date_created", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="is_deleted", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="tax", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="number_developers", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.ssn", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.date_of_birth", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.info.salary", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="leader.info.phone", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="long_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="lat_location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="level_domain", FunctionApply="DefaultDomainPrivacy.Show" }
                        },
                        Condition = expression.Parse(Rules[0]) },
                }

            });

            #endregion
            privacyCollection.InsertManyAsync(data);
        }

        public static void InsertPolicyForDemo(string policyDB, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "StringEqual ( Subject.role , 'intern' )"
            };
            string[] Rules = new string[]
            {
                "StringEqual ( Environment.purpose , 'analysis' )",
                "StringEqual ( Resource.dept_name , 'OPERATIONS' )",
                "StringEqual ( Resource.language , 'English' )",
                "StringEqual ( Resource.language , 'Spanish' )"
            };
            var data = new List<PrivacyPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDB);

            var privacyCollection = _database.GetCollection<PrivacyPolicy>("PrivacyPolicy");

            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="dept_id", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="_id", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="dept_name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.phone", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="projects", FunctionApply="DepartmentProjects.Policy3" }
                        },
                        Condition = expression.Parse(Rules[1]) }
                }
            });
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 2",
                Target = expression.Parse(Targets[0]),
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="dept_id", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="_id", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="dept_no", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="dept_name", FunctionApply="Optional" },
                            new FieldEffect { Name="leader.name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="leader.phone", FunctionApply="DefaultDomainPrivacy.Hide" },
                            new FieldEffect { Name="location", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="projects", FunctionApply="Optional" }
                        },
                        Condition = expression.Parse(Rules[0]) }
                }
            });
            data.Add(new PrivacyPolicy
            {
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "Policy3",
                Target = null,
                Rules = new FieldRule[] {
                    new FieldRule {
                        Identifer = "rule 1",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="language", FunctionApply="DefaultDomainPrivacy.Hide" }
                        },
                        Condition = expression.Parse(Rules[2]) },
                    new FieldRule {
                        Identifer = "rule 2",
                        FieldEffects = new FieldEffect[] {
                            new FieldEffect { Name="name", FunctionApply="DefaultDomainPrivacy.Show" },
                            new FieldEffect { Name="language", FunctionApply="DefaultDomainPrivacy.Hide" }
                        },
                        Condition = expression.Parse(Rules[3]) },
                }
            });
        }
    }
}
