using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Utilities
{
    public class ExpressionParser
    {
        public FilterDefinition<BsonDocument> ParseCondition(string condition)
        {
            var stack = new Stack<string>();
            var queue = new Queue<string>();

            var builder = Builders<BsonDocument>.Filter;
            var filter = builder.Eq("x", 10) & !builder.Lt("y", 20);
            string[] keywords = condition.Split(' ');
            #region Poland Notation
            foreach (var keyword in keywords)
            {
                if (IsLogicOperator(keyword))
                {
                    if (!stack.Any())
                    {
                        stack.Push(keyword);
                        continue;
                    }
                    string op = stack.Peek();
                    if (Priority(keyword) <= Priority(op))
                    {
                        while (stack.Count() != 0)
                        {
                            string s = stack.Peek();
                            if (s.Equals("(") || s.Equals("NOT("))
                                break;
                            else
                            {
                                string temp = stack.Pop();
                                queue.Enqueue(temp);
                            }
                        }
                    }
                    stack.Push(keyword);
                }
                else if (keyword.Equals("(", StringComparison.OrdinalIgnoreCase))
                {
                    stack.Push(keyword);
                }
                else if (keyword.Equals(")", StringComparison.OrdinalIgnoreCase))
                {
                    while (stack.Count() != 0)
                    {
                        string s = stack.Pop();
                        if (s.Equals("(", StringComparison.OrdinalIgnoreCase))
                            break;
                        if (s.Equals("NOT(", StringComparison.OrdinalIgnoreCase))
                        {
                            queue.Enqueue("NOT");
                            break;
                        }
                        queue.Enqueue(s);
                    }
                }
                else queue.Enqueue(keyword);
            }
            while (stack.Count() != 0)
            {
                queue.Enqueue(stack.Pop());
            }
            #endregion
            var stackBuilder = new Stack<FilterDefinition<BsonDocument>>();
            while (queue.Any())
            {
                string keyword = queue.Dequeue();
                if (keyword.Equals("AND"))
                {
                    var op1 = stackBuilder.Pop();
                    var op2 = stackBuilder.Pop();
                    var result = (op1 & op2);
                    stackBuilder.Push(result);
                }
                else if (keyword.Equals("OR"))
                {
                    var op1 = stackBuilder.Pop();
                    var op2 = stackBuilder.Pop();
                    var result = (op1 | op2);
                    stackBuilder.Push(result);
                }
                else if (keyword.Equals("NOT"))
                {
                    var op1 = stackBuilder.Pop();
                    var result = !op1;
                    stackBuilder.Push(result);
                }
                else
                {
                    stackBuilder.Push(ConvertToFilterDefinition(keyword));
                }
            }
            return stackBuilder.Pop();
        }

        private bool IsLogicOperator(string keyword)
        {
            if (keyword.Equals("AND", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("OR", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("NOT(", StringComparison.OrdinalIgnoreCase))
                return true;
            return false;
        }
        private int Priority(string op)
        {
            if (op.Equals("NOT(", StringComparison.OrdinalIgnoreCase))
                return 3;
            else if (op.Equals("AND", StringComparison.OrdinalIgnoreCase))
                return 2;
            else return 1;
        }
        private FilterDefinition<BsonDocument> ConvertToFilterDefinition(string condition)
        {
            var filter = Builders<BsonDocument>.Filter;
            string op = condition.Split('(')[0];
            string field = condition.Split('(')[1].Split(',')[0];
            string value = condition.Split('(')[1].Split(',')[0];
            if (op.Equals("Equals"))
                return filter.Eq(field, value);
            else if (op.Equals("GreaterThan"))
                return filter.Gt(field, int.Parse(value));
            else if (op.Equals("LessThan"))
                return filter.Lt(field, int.Parse(value));
            return null;
        }
    }
}
