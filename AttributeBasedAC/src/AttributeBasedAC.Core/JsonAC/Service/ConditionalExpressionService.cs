using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Repository;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class ConditionalExpressionService : IConditionalExpressionService
    {

        bool IConditionalExpressionService.Evaluate(Function function, JObject user, JObject resource, JObject environment)
        {
            var parameters = new List<string>();

            foreach (var param in function.Parameters)
            {
                // if parameter is another function
                if (param.Value == null)
                {
                    parameters.Add(InvokeFunction(param, user, resource, environment));
                }
                else
                {
                    // if parameter is a constant value
                    if (param.ResourceID == null)
                    {
                        parameters.Add(param.Value);
                    }
                    // if parameter is a value taken from repository
                    else
                    {
                        JToken value = null;
                        switch (param.ResourceID)
                        {
                            case "Subject":
                                value = user.SelectToken(param.Value);
                                break;
                            case "Environment":
                                value = environment.SelectToken(param.Value);
                                break;
                            default:
                                value = resource.SelectToken(param.Value);
                                break;
                        }
                        if (value == null)
                            return false;
                        else parameters.Add(value.ToString());
                    }
                }
            }

            Type type = Type.GetType("AttributeBasedAC.Core.JsonAC.UserDefinedFunctionFactory");
            MethodInfo method = type.GetMethod(function.FunctionName);
            string result = String.Empty;
            if (method.GetParameters().Length > 0)
            {
                result = method.GetParameters()[0].ParameterType.IsArray
                       ? method.Invoke(null, new object[] { parameters.ToArray() }).ToString()
                       : method.Invoke(null, parameters.ToArray()).ToString();
            }
            else result = method.Invoke(null, null).ToString();

            return bool.Parse(result);
        }

        private string InvokeFunction(Function function, JObject user, JObject resource, JObject environment)
        {
            var parameters = new List<object>();

            foreach (var param in function.Parameters)
            {
                // if parameter is another function
                if (param.Value == null)
                {
                    string resultFunctionInvoke = InvokeFunction(param, user, resource, environment);
                    if (resultFunctionInvoke == null) return "";
                    else
                    {
                        bool isOrOperatorEscape = (function.FunctionName == "Or" && resultFunctionInvoke == "true");
                        bool isAndOperatorEscape = (function.FunctionName == "And" && resultFunctionInvoke == "false");

                        if (isOrOperatorEscape || isAndOperatorEscape) return "true";
                    }
                    parameters.Add(resultFunctionInvoke);
                }
                else
                {
                    // if parameter is a constant value
                    if (param.ResourceID == null)
                    {
                        parameters.Add(param.Value);
                    }
                    // if parameter is a value taken from repository
                    else
                    {
                        JToken value = null;
                        switch (param.ResourceID)
                        {
                            case "Subject":
                                value = user.SelectToken(param.Value);
                                break;
                            case "Environment":
                                value = environment.SelectToken(param.Value);
                                break;
                            default:
                                value = resource.SelectToken(param.Value);
                                break;
                        }
                        if (value == null)
                            return "";

                        parameters.Add(value.ToString());
                    }
                }
            }

            string result = String.Empty;
            Type type = Type.GetType("AttributeBasedAC.Core.JsonAC.UserDefinedFunctionFactory");
            MethodInfo method = type.GetMethod(function.FunctionName);
            if (method.GetParameters().Length > 0)
            {
                result = method.GetParameters()[0].ParameterType.IsArray
                       ? method.Invoke(null, new object[] { parameters.ToArray() }).ToString()
                       : method.Invoke(null, parameters.ToArray()).ToString();
            }
            else result = method.Invoke(null, null).ToString();
            return result;
        }
        /// <summary>
        /// Or (Equal (Resource._id,1232), Equal (Subject.role,leader))
        /// Equal(Resource._id,function(a,b)) Or Equal(Subject.role,leader)
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        Function IConditionalExpressionService.Parse(string condition)
        {
            var stack = new Stack<string>();
            var queue = new Queue<string>();

            var resultFunction = new Function();
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
                    if (op.Equals("("))
                    {
                        stack.Push(keyword);
                        continue;
                    }
                    if (Priority(keyword) <= Priority(op))
                    {
                        while (stack.Count() != 0)
                        {
                            string s = stack.Peek();
                            if (s.Equals("("))
                                break;
                            else
                            {
                                string temp = stack.Pop();
                                queue.Enqueue(temp);
                            }
                        }
                        stack.Push(keyword);
                        continue;
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
            var stackBuilder = new Stack<Function>();
            while (queue.Any())
            {
                string keyword = queue.Dequeue();
                if (keyword.Equals("AND"))
                {
                    var op1 = stackBuilder.Pop();
                    var op2 = stackBuilder.Pop();
                    //var result = (op1 & op2);
                    //stackBuilder.Push(result);
                }
                else if (keyword.Equals("OR"))
                {
                    var op1 = stackBuilder.Pop();
                    var op2 = stackBuilder.Pop();
                    //var result = (op1 | op2);
                    //stackBuilder.Push(result);
                }
                else if (keyword.Equals("NOT"))
                {
                    var op1 = stackBuilder.Pop();
                    //var result = !op1;
                    //stackBuilder.Push(result);
                }
                else
                {
                    //stackBuilder.Push(ConvertToFilterDefinition(keyword));
                }
            }
            return stackBuilder.Pop();
        }

        private bool IsLogicOperator(string keyword)
        {
            if (keyword.Equals("AND", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("OR", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("NOT", StringComparison.OrdinalIgnoreCase))
                return true;
            return false;
        }

        private int Priority(string op)
        {
            if (op.Equals("NOT", StringComparison.OrdinalIgnoreCase))
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
