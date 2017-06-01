using AttributeBasedAC.Core.JsonAC.Service;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator.Model
{
    public class Project
    {
        public string name { get; set; }

        public string language { get; set; }
    }
    public class Leader
    {
        public string name { get; set; }
        public string phone { get; set; }
    }
    public class Department
    {
        public int dept_id { get; set; }

        public string dept_name { get; set; }

        public string dept_no { get; set; }

        public string location { get; set; }

        public Leader leader { get; set; }

        public Project[] projects { get; set; }
    }

    public static class DepartmentRepository
    {
        public static void InsertPolicyForDemo(string userDb, IConditionalExpressionService expression)
        {
            var data = new List<Department>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(userDb);

            var userCollection = _database.GetCollection<Department>("Department");

            data.Add(new Department()
            {
                dept_id = 10,
                dept_no = "D10",
                dept_name = "ACCOUNTING",
                location = "NEW YORK",
                leader = new Leader()
                {
                    name = "John",
                    phone = "1221315456"
                },
                projects = new Project[2] {
                    new Project() { name = "ERP", language = "English"},
                    new Project() { name = "ERP2", language= "Spanish"}
                }
            });
            data.Add(new Department()
            {
                dept_id = 40,
                dept_no = "D40",
                dept_name = "OPERATIONS",
                location = "BOSTON",
                leader = new Leader()
                {
                    name = "Alice",
                    phone = "44441315456"
                },
                projects = new Project[2] {
                    new Project() { name = "CRM", language = "English"},
                    new Project() { name = "CRM2", language= "Spanish"}
                }
            });
            data.Add(new Department()
            {
                dept_id = 20,
                dept_no = "D20",
                dept_name = "OPERATIONS",
                location = "NEW YORK",
                leader = new Leader()
                {
                    name = "John",
                    phone = "1221315456"
                },
                projects = new Project[2] {
                    new Project() { name = "Banking", language = "English"},
                    new Project() { name = "Banking2", language= "Spanish"}
                }
            });


            userCollection.InsertMany(data);
        }
    }
}
