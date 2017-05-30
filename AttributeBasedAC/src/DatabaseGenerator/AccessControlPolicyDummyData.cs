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
    public class AccessControlPolicyDummyData
    {
        public static void Insert(string policyDb, IConditionalExpressionService expression)
        {
            var data = new List<AccessControlPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");

            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[0]),
                Rules = new AccessControlRule[] { new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[0]) } }
            });
            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[1]),
                Rules = new AccessControlRule[] { new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[1]) } }
            });
            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[2]),
                Rules = new AccessControlRule[] { new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[2]) } }
            });

            acPolicyCollection.InsertMany(data);
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

        public static void InsertFivePoliciesForTestingPerformance(string policyDb, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "BooleanEqual ( Subject.active , 'true' )"
            };
            string[] Rules = new string[]
            {
                "IntegerGreaterThan ( Resource.number_developers , '15' ) AND IntegerGreaterThan ( Subject.age , '15' ) AND DateGreaterThan ( Resource.leader.info.date_of_birth , '1/1/1995' )"
            };
            var data = new List<AccessControlPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");

            for (int i = 1; i <= 4; i++)
            {
                data.Add(new AccessControlPolicy
                {
                    Action = "read",
                    CollectionName = "Department",
                    Description = "....",
                    IsAttributeResourceRequired = true,
                    PolicyId = "policy 1",
                    RuleCombining = "deny-overrides",
                    Target = expression.Parse(Targets[0]),
                    Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 1", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 2", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Deny", Condition = expression.Parse(Rules[0]) }
                }
                });
            }
            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[0]),
                Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 2", Effect = "Permit", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Permit", Condition = expression.Parse(Rules[0]) }
                }
            });

            acPolicyCollection.InsertMany(data);
        }

        public static void InsertTenPoliciesForTestingPerformance(string policyDb, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "BooleanEqual ( Subject.active , 'true' )"
            };
            string[] Rules = new string[]
            {
                "DoubleLessThan ( Resource.tax , 1000 ) AND IntegerGreaterThan ( Resource.dept_no , '0' ) AND IntegerGreaterThan ( Resource.number_developers , '15' ) AND IntegerGreaterThan ( Subject.age , '15' ) AND DateGreaterThan ( Resource.leader.info.date_of_birth , '1/1/1995' )"
            };
            var data = new List<AccessControlPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");

            for (int i = 1; i <= 6; i++)
            {
                data.Add(new AccessControlPolicy
                {
                    Action = "read",
                    CollectionName = "Department",
                    Description = "....",
                    IsAttributeResourceRequired = true,
                    PolicyId = "policy 1",
                    RuleCombining = "deny-overrides",
                    Target = expression.Parse(Targets[0]),
                    Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 1", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 2", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Deny", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Deny", Condition = expression.Parse(Rules[0]) }
                }
                });
            }
            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = true,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[0]),
                Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 2", Effect = "Permit", Condition = expression.Parse(Rules[0]) },
                    new AccessControlRule { Id = "rule 3", Effect = "Permit", Condition = expression.Parse(Rules[0]) }
                }
            });

            acPolicyCollection.InsertMany(data);
        }

        public static void InsertPolicyForDemo(string policyDb, IConditionalExpressionService expression)
        {
            string[] Targets = new string[]
            {
                "BooleanEqual ( Subject.active , 'true' )"
            };
            string[] Rules = new string[]
            {
                "StringEqual ( Subject.role , 'intern' ) Or StringEqual ( Subject.role , 'doctor' )",
                
                "IntegerGreaterThan ( Resource.number_developers , '12' )"
            };
            var data = new List<AccessControlPolicy>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(policyDb);

            var acPolicyCollection = _database.GetCollection<AccessControlPolicy>("AccessControlPolicy");

            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 1",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[0]),
                Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 1", Effect = "Permit", Condition = expression.Parse(Rules[0]) }
                }
            });

            data.Add(new AccessControlPolicy
            {
                Action = "read",
                CollectionName = "Department",
                Description = "....",
                IsAttributeResourceRequired = false,
                PolicyId = "policy 2",
                RuleCombining = "permit-overrides",
                Target = expression.Parse(Targets[1]),
                Rules = new AccessControlRule[] {
                    new AccessControlRule { Id = "rule 2", Effect = "Permit", Condition = expression.Parse(Rules[1]) }
                }
            });

            acPolicyCollection.InsertMany(data);
        }
    }
}
