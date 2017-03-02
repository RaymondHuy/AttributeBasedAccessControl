using AttributeBasedAC.Core.Exceptions;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonABAC
{
    [BsonIgnoreExtraElements]
    public class Expression
    {
        [BsonElement("operator")]
        private string _operator { get; set; }

        [BsonElement("clauses")]
        public List<Clause> Clauses { get; set; }

        [BsonElement("condition")]
        public Expression Condtion { get; set; }

        public Operator Operator
        {
            get
            {
                switch (_operator)
                {
                    case "and":
                        return Operator.AND;
                    case "or":
                        return Operator.OR;
                    case "not":
                        return Operator.NOT;
                }
                throw new OperatorException("Unsupported operator");
            }
        }
    }
}
