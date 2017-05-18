using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase.UserDefaultDatabase
{
    public class Department
    {
        [BsonElement("dept_id")]
        public string DeptId { get; set; }

        [BsonElement("date_created")]
        public string DateCreated { get; set; }

        [BsonElement("is_deleted")]
        public bool IsDeleted { get; set; }

        [BsonElement("tax")]
        public double Tax { get; set; }

        [BsonElement("number_developers")]
        public int NumberDevelopers { get; set; }

        [BsonElement("technologies")]
        public ICollection<string> Technologies { get; set; }

        [BsonElement("leader")]
        public Leader Leader { get; set; }

        [BsonElement("dept_no")]
        public int DeptNumber { get; set; }

        [BsonElement("location")]
        public string Location { get; set; }

        [BsonElement("projects")]
        public ICollection<Project> Projects { get; set; }
    }

    public class Leader
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("info")]
        public PersonalInfo Info { get; set; }
    }

    public class PersonalInfo
    {
        [BsonElement("phone")]
        public string Phone { get; set; }

        [BsonElement("ssn")]
        public string SSN { get; set; }

        [BsonElement("date_of_birth")]
        public string DOB { get; set; }

        [BsonElement("salary")]
        public double Salary { get; set; }
    }

    public class Project
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("language")]
        public string Language { get; set; }
    }

    public static class DepartmentRepository
    {
        public static void InsertDummyData(string userDb)
        {
            var data = new List<Department>();
            data.Add(new Department
            {
                DateCreated = "5/15/2017",
                DeptId = "MAS_01",
                DeptNumber = 30,
                IsDeleted = false,
                Location = "NEW YORK",
                NumberDevelopers = 10,
                Tax = 12.5,
                Technologies = new string[] { "Android", "iOS" },
                Leader = new Leader { Name = "John", Info = new PersonalInfo { DOB = "10/12/1990", Phone = "0123456789", SSN = "123-aa-ssss", Salary = 200.15 } },
                Projects = new Project[] { new Project { Language = "English", Name = "ERP" }, new Project { Language = "Vietnamese", Name = "CRM" } }
            });
            data.Add(new Department
            {
                DateCreated = "4/4/2012",
                DeptId = "MAS_02",
                DeptNumber = 50,
                IsDeleted = false,
                Location = "Ho Chi Minh",
                NumberDevelopers = 17,
                Tax = 22.5,
                Technologies = new string[] { "Java", "NodeJS" },
                Leader = new Leader { Name = "Bob", Info = new PersonalInfo { DOB = "10/10/1980", Phone = "112314615151", SSN = "235-vb-aadd", Salary = 130.15 } },
                Projects = new Project[] { new Project { Language = "Spanish", Name = "SAP" }, new Project { Language = "Chinese", Name = "DMS" } }
            });
            data.Add(new Department
            {
                DateCreated = "2/4/2014",
                DeptId = "MAS_03",
                DeptNumber = 32,
                IsDeleted = false,
                Location = "London",
                NumberDevelopers = 13,
                Tax = 12.5,
                Technologies = new string[] { "C++", "COBOL", "SQL" },
                Leader = new Leader { Name = "John", Info = new PersonalInfo { DOB = "5/10/1990", Phone = "0123456789", SSN = "123-aa-ssss", Salary = 200.15 } },
                Projects = new Project[] { new Project { Language = "English", Name = "E-learning" }, new Project { Language = "Chinese", Name = "E-commerce" } }
            });
            data.Add(new Department
            {
                DateCreated = "12/4/2015",
                DeptId = "MAS_04",
                DeptNumber = 22,
                IsDeleted = false,
                Location = "London",
                NumberDevelopers = 23,
                Tax = 72.5,
                Technologies = new string[] { "C#", "AngularJS", "Oracle" },
                Leader = new Leader { Name = "Bob", Info = new PersonalInfo { DOB = "10/10/1980", Phone = "112314615151", SSN = "235-vb-aadd", Salary = 130.15 } },
                Projects = new Project[] { new Project { Language = "English", Name = "Banking" }, new Project { Language = "Chinese", Name = "Financial" } }
            });
            data.Add(new Department
            {
                DateCreated = "12/4/2015",
                DeptId = "MAS_06",
                DeptNumber = 52,
                IsDeleted = true,
                Location = "London",
                NumberDevelopers = 14,
                Tax = 74.2,
                Technologies = new string[] { "iOS", "C#", "Pascal" },
                Leader = new Leader { Name = "Bob", Info = new PersonalInfo { DOB = "10/10/1980", Phone = "112314615151", SSN = "235-vb-aadd", Salary = 130.15 } },
                Projects = new Project[] { new Project { Language = "English", Name = "Agriculture Management" }, new Project { Language = "Chinese", Name = "Financial" } }
            });

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(userDb);

            var department = _database.GetCollection<Department>("Department");
            department.InsertMany(data);
        }
    }
}
