using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttributeBasedAC.Core.JsonAC.Model;
using AttributeBasedAC.Core.JsonAC.Repository;
using System.Reflection;
using Newtonsoft.Json.Linq;
using AttributeBasedAC.Core.Infrastructure;
using AttributeBasedAC.Core.JsonAC.UserDefinedFunction;

namespace AttributeBasedAC.Core.JsonAC.Service
{
    public class ConditionalExpressionService : IConditionalExpressionService
    {
        private MethodInfo[] methods;
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
                            throw new ConditionalExpressionException("Missing field " + param.Value + " of field: " + param.ResourceID);
                        else parameters.Add(value.ToString());
                    }
                }
            }
            var factory = UserDefinedFunctionPluginFactory.GetInstance();
            MethodInfo method = factory.GetFunction(function.FunctionName);
            if (method == null)
                throw new ConditionalExpressionException("Can not find the method: " + function.FunctionName + " Please registers it in UserDefinedFunctionPluginFactory");
            string result = String.Empty;
            if (method.GetParameters().Length > 0)
            {
                result = method.GetParameters()[0].ParameterType.IsArray
                       ? method.Invoke(null, new object[] { parameters.ToArray() }).ToString()
                       : method.Invoke(null, parameters.ToArray()).ToString();
            }
            else result = method.Invoke(null, null).ToString();
            bool expressionResult;
            bool isConvertSuccessfully = Boolean.TryParse(result, out expressionResult);
            if (!isConvertSuccessfully)
                throw new ConditionalExpressionException("Method " + function.FunctionName + " didn't return boolean value");
            return expressionResult;
        }

        bool IConditionalExpressionService.IsAccessControlPolicyRelateToContext(AccessControlPolicy policy, JObject user, JObject resource, JObject environment)
        {
            if (CheckRelativeFunction(policy.Target, user, resource, environment) == true)
                return true;

            foreach (var rule in policy.Rules)
            {
                if (CheckRelativeFunction(rule.Condition, user, resource, environment) == true)
                    return true;
            }
            return false;
        }
        /// <summary>
        /// Or (Equal (Resource._id,1232), Equal (Subject.role,leader))
        /// Equal ( Resource._id , Function1 ( Resource.name , b ) ) Or Equal ( Subject.role , leader )
        /// </summary>
        /// <param name="condition"></param>
        /// <returns></returns>
        Function IConditionalExpressionService.Parse(string condition)
        {
            var queue = PolandNotationProcess(condition);
            var queueBuilder = new Queue<Function>();
            while (queue.Any())
            {
                string keyword = queue.Dequeue();
                var method = GetUserFunction(keyword);
                if (method != null)
                {
                    var function = new Function()
                    {
                        FunctionName = keyword,
                        Parameters = new List<Function>()
                    };
                    int count = method.GetParameters().Length;
                    for (int i = 0; i < count; i++)
                    {
                        function.Parameters.Add(queueBuilder.Dequeue());
                    }
                    queueBuilder.Enqueue(function);
                }
                else if (keyword.Equals("AND"))
                {
                    var function = new Function()
                    {
                        FunctionName = "And",
                        Parameters = new List<Function>()
                    };
                    function.Parameters.Add(queueBuilder.Dequeue());
                    function.Parameters.Add(queueBuilder.Dequeue());
                    queueBuilder.Enqueue(function);
                }
                else if (keyword.Equals("OR"))
                {
                    var function = new Function()
                    {
                        FunctionName = "Or",
                        Parameters = new List<Function>()
                    };
                    function.Parameters.Add(queueBuilder.Dequeue());
                    function.Parameters.Add(queueBuilder.Dequeue());
                    queueBuilder.Enqueue(function);
                }
                else if (keyword.Equals("NOT"))
                {
                    var function = new Function()
                    {
                        FunctionName = "Not",
                        Parameters = new List<Function>()
                    };
                    function.Parameters.Add(queueBuilder.Dequeue());
                    queueBuilder.Enqueue(function);
                }
                else if (keyword.Contains("."))
                {
                    int idxResourceName = keyword.IndexOf('.');
                    var function = new Function()
                    {
                        ResourceID = keyword.Substring(0, idxResourceName),
                        Value = keyword.Substring(idxResourceName + 1)
                    };
                    queueBuilder.Enqueue(function);
                }
                else queueBuilder.Enqueue(new Function() { Value = keyword });
            }
            return queueBuilder.Dequeue();
        }

        private bool? CheckRelativeFunction(Function function, JObject user, JObject resource, JObject environment)
        {
            var parameters = new List<string>();
            bool hasRelativeField = false;
            foreach (var param in function.Parameters)
            {
                // if parameter is another function
                if (param.Value == null)
                {
                    bool? isRelative = CheckRelativeFunction(param, user, resource, environment);
                    if (isRelative == true)
                        return true;
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
                        if (value != null)
                        {
                            parameters.Add(value.ToString());
                            hasRelativeField = true;
                        }
                        else
                        {
                            parameters.Add(null);
                        }
                    }
                }
            }
            try
            {
                var factory = UserDefinedFunctionPluginFactory.GetInstance();
                MethodInfo method = factory.GetFunction(function.FunctionName);
                if (method == null)
                    throw new ConditionalExpressionException("Can not find the method: " + function.FunctionName + " Please implement it in UserDefinedFunctionFactory");
                string result = String.Empty;
                if (method.GetParameters().Length > 0)
                {
                    result = method.GetParameters()[0].ParameterType.IsArray
                           ? method.Invoke(null, new object[] { parameters.ToArray() }).ToString()
                           : method.Invoke(null, parameters.ToArray()).ToString();
                }
                else result = method.Invoke(null, null).ToString();
                var isRelative = bool.Parse(result);
                return isRelative;
            }
            catch (Exception)
            {
                if (hasRelativeField)
                    return true;
                return null;
            }
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
            var factory = UserDefinedFunctionPluginFactory.GetInstance();
            MethodInfo method = factory.GetFunction(function.FunctionName);
            if (method == null)
                throw new ConditionalExpressionException("Can not find the method: " + function.FunctionName + " Please implement it in UserDefinedFunctionFactory");
            if (method.GetParameters().Length > 0)
            {
                result = method.GetParameters()[0].ParameterType.IsArray
                       ? method.Invoke(null, new object[] { parameters.ToArray() }).ToString()
                       : method.Invoke(null, parameters.ToArray()).ToString();
            }
            else result = method.Invoke(null, null).ToString();
            return result;
        }

        public Queue<string> PolandNotationProcess(string condition)
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
                else if (GetUserFunction(keyword) != null)
                {
                    stack.Push(keyword);
                }
                else if (keyword.Equals(")", StringComparison.OrdinalIgnoreCase))
                {
                    while (stack.Count() != 0)
                    {
                        string s = stack.Pop();
                        if (s.Equals("(", StringComparison.OrdinalIgnoreCase))
                        {
                            string methodName = stack.Any() ? stack.Pop() : String.Empty;
                            if (methodName != null)
                                queue.Enqueue(methodName);
                            break;
                        }
                        queue.Enqueue(s);
                    }
                }
                else if (keyword.Equals(",") || keyword.Equals(""))
                    continue;
                else queue.Enqueue(keyword);
            }
            while (stack.Count() != 0)
            {
                queue.Enqueue(stack.Pop());
            }
            #endregion
            return queue;
        }

        private bool IsLogicOperator(string keyword)
        {
            if (keyword.Equals("AND", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("OR", StringComparison.OrdinalIgnoreCase)
             || keyword.Equals("NOT", StringComparison.OrdinalIgnoreCase))
                return true;
            return false;
        }

        private MethodInfo GetUserFunction(string keyword)
        {
            var factory = UserDefinedFunctionPluginFactory.GetInstance();
            return factory.GetFunction(keyword);
        }

        private int Priority(string op)
        {
            if (op.Equals("NOT", StringComparison.OrdinalIgnoreCase))
                return 3;
            else if (op.Equals("AND", StringComparison.OrdinalIgnoreCase))
                return 2;
            else return 1;
        }

        bool IConditionalExpressionService.IsPrivacyPolicyRelateToContext(PrivacyPolicy policy, JObject user, JObject resource, JObject environment)
        {
            if (policy.Target != null)
            {
                if (CheckRelativeFunction(policy.Target, user, resource, environment) == true)
                    return true;
            }

            foreach (var rule in policy.Rules)
            {
                if (CheckRelativeFunction(rule.Condition, user, resource, environment) == true)
                    return true;
            }
            return false;
        }
    }
}
