using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreateAndSetupDatabase.UserDefaultDatabase
{
    public class User
    {
        [BsonElement("dept_id")]
        public string Name { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("phone")]
        public string Phone { get; set; }

        [BsonElement("age")]
        public int Age { get; set; }

        [BsonElement("active")]
        public bool Active { get; set; }

        [BsonElement("Role")]
        public string Role { get; set; }
    }

    public static class UserRepository
    {
        public static void InsertDummyData(string userDb)
        {
            var data = new List<User>();
            data.Add(new User
            {
                Active = true,
                Age = 30,
                Email = "John@gmail.com",
                Name = "John",
                Password = "bfaebfiubaliaybgslisgdlisaygd",
                Phone = "0123456789",
                Role = "Admin"
            });
            data.Add(new User
            {
                Active = false,
                Age = 32,
                Email = "Alice@gmail.com",
                Name = "Alice",
                Password = "aakkakakakakddefef",
                Phone = "147852963",
                Role = "Manager"
            });
            data.Add(new User
            {
                Active = true,
                Age = 42,
                Email = "Bob@gmail.com",
                Name = "Bob",
                Password = "wwerqefddafadf",
                Phone = "555899315483",
                Role = "Admin"
            });
            data.Add(new User
            {
                Active = true,
                Age = 29,
                Email = "Beck@gmail.com",
                Name = "Beck",
                Password = "eqwerfjpaijlisgdlisaygd",
                Phone = "789456123",
                Role = "Developer"
            });
            data.Add(new User
            {
                Active = false,
                Age = 29,
                Email = "Scot@gmail.com",
                Name = "Scot",
                Password = "aaaaaaaaaa",
                Phone = "56483135146846",
                Role = "Admin"
            });

            IMongoClient _client = new MongoClient();
            IMongoDatabase _database = _client.GetDatabase(userDb);

            var users = _database.GetCollection<User>("User");
            users.InsertMany(data);
        }
    }
}
