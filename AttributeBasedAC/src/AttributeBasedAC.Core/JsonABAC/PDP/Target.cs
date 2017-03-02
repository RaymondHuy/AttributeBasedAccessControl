using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    public class Target
    {
        [BsonElement("access_subjects")]
        public ICollection<AccessSubject> AccessSubjects { get; set; }

        [BsonElement("resource_id")]
        public string ResourceID { get; set; }

        [BsonElement("action")]
        private ICollection<string> _actions { get; set; }

        public ICollection<Action> Actions
        {
            get
            {
                if (Actions == null)
                {
                    Actions = new List<Action>();
                    foreach (string action in _actions)
                    {
                        if (action == "read")
                            Actions.Add(Action.Read);
                        else if (action == "write")
                            Actions.Add(Action.Write);
                        else throw new Exception();
                    }
                }
                return Actions;
            }
            private set { }
        }
    }
}
