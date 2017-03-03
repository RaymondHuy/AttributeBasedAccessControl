using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    public class SubjectRepository
    {
        private readonly IMongoDatabase _mongoDatabase;

        public SubjectRepository(string databaseName)
        {
            IMongoClient _client = new MongoClient();
            _mongoDatabase = _client.GetDatabase(databaseName);
        }
    }
}
