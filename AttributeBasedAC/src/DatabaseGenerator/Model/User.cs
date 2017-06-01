using AttributeBasedAC.Core.JsonAC.Service;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator.Model
{
    public class User
    {
        public string access_token { get; set; }

        public string role { get; set; }

        public string name { get; set; }

        public bool active { get; set; }

        public string country { get; set; }

        public string univeristy { get; set; }

        public int[] GPA { get; set; }

        public string department { get; set; }
    }

    public class UserRepository
    {
        public static void InsertPolicyForDemo(string userDb, IConditionalExpressionService expression)
        {
            var data = new List<User>();

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(userDb);

            var userCollection = _database.GetCollection<User>("User");

            data.Add(new User()
            {
                access_token = "0303ed2d-fb7d-4f34-8356-37d551cfe2ef",
                active = true,
                country = "USA",
                univeristy = "Havard",
                GPA = new int[3] { 0, 1, 2 },
                department = "OPERATIONS",
                role = "doctor",
                name = "Bob"
            });
            data.Add(new User()
            {
                access_token = "f229d5b-a6c5-4c72-a151-34e121690e19",
                active = true,
                country = "USA",
                univeristy = "Oxford",
                GPA = new int[3] { 0, 1, 2 },
                department = "OPERATIONS",
                role = "intern",
                name = "alice"
            });
            data.Add(new User()
            {
                access_token = "0303ed2d-fb7d-4f34-8356-37d551cfe2ef",
                active = false,
                country = "USA",
                univeristy = "Havard",
                GPA = new int[3] { 0, 1, 2 },
                department = "ACCOUNTING",
                role = "doctor",
                name = "john"
            });

            userCollection.InsertMany(data);
        }
    }
}
