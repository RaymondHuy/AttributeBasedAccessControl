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

        public string department { get; set; }

        public string ssn { get; set; }

        public string date_of_birth { get; set; }

        public string address { get; set; }
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
                department = "OPERATIONS",
                role = "doctor",
                name = "Bob",
                date_of_birth = "3/5/1992",
                ssn = "509-70-2308",
                address = "25, Dovetail, Place"
            });
            data.Add(new User()
            {
                access_token = "f229d5b-a6c5-4c72-a151-34e121690e19",
                active = true,
                country = "USA",
                univeristy = "Oxford",
                department = "OPERATIONS",
                role = "intern",
                name = "alice",
                date_of_birth = "1/5/1991",
                ssn = "515-56-7769",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "0303ed2d-fb7d-4f34-8356-37d551cfe2ef",
                active = false,
                country = "USA",
                univeristy = "Havard",
                department = "ACCOUNTING",
                role = "doctor",
                name = "john",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            #region dummydata
            data.Add(new User()
            {
                access_token = "372793ce-fa96-4f3e-9eba-efd2481763c4",
                active = true,
                country = "VN",
                univeristy = "Oxford",
                department = "OPERATIONS",
                role = "intern",
                name = "alex",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "72d25ae9-5334-4f12-9fdf-2094a859215c",
                active = true,
                country = "Singapore",
                univeristy = "Oxford",
                department = "OPERATIONS",
                role = "doctor",
                name = "Nam",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "28f7c733-20fb-469d-a12d-4d7ca93417ae",
                active = true,
                country = "USA",
                univeristy = "Havard",
                department = "OPERATIONS",
                role = "doctor",
                name = "john",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "8d78d11f-5c64-4ac6-9788-3114984b0153",
                active = true,
                country = "England",
                univeristy = "Havard",
                department = "ACCOUNTING",
                role = "intern",
                name = "rey",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "8d4391a4-a4a7-41d9-85e6-8d9f05408e2b",
                active = true,
                country = "Crotia",
                univeristy = "Havard",
                department = "ACCOUNTING",
                role = "doctor",
                name = "john",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "b2a65bc2-a1f3-4958-8887-8cd6fe3a0bf7",
                active = false,
                country = "USA",
                univeristy = "Havard",
                department = "ACCOUNTING",
                role = "doctor",
                name = "john",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            data.Add(new User()
            {
                access_token = "cd2d7f54-e4dd-4783-b8d8-e5effd855fe7",
                active = false,
                country = "USA",
                univeristy = "Havard",
                department = "ACCOUNTING",
                role = "doctor",
                name = "john",
                date_of_birth = "6/4/1951",
                ssn = "475-31-1840",
                address = "088, Straubel, Circle"
            });
            #endregion

            userCollection.InsertMany(data);
        }
    }
}
