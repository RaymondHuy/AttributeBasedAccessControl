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
    public class ExpressionService : IExpressionService
    {
        private readonly ISubjectRepository _subjectRepository;
        private readonly IResourceRepository _resourceRepository;
        private readonly IEnvironmentRepository _environmentRepository;

        public ExpressionService(
            ISubjectRepository subjectRepository,
            IResourceRepository resourceRepository,
            IEnvironmentRepository environmentRepository)
        {
            _subjectRepository = subjectRepository;
            _resourceRepository = resourceRepository;
            _environmentRepository = environmentRepository;
        }

        bool IExpressionService.Evaluate(Function function, JObject user, JObject resource, JObject environment)
        {
            List<string> parameters = new List<string>();

            foreach (var param in function.Parameters)
            {
                // if parameter is another function
                if (param.Value == null)
                {
                    // need checking for faster evaluate
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

            MethodInfo method = typeof(UserDefinedFunctionFactory).GetMethod(function.FunctionName);
            //string[] arr = parameters.ToArray();
            bool result = (bool)method.Invoke(null, new object[] { parameters.ToArray()});

            return result;
        }

        private string InvokeFunction(Function function, JObject user, JObject resource, JObject environment)
        {
            List<object> parameters = new List<object>();
            string result;

            foreach (var param in function.Parameters)
            {
                // if parameter is another function
                if (param.Value == null)
                {
                    string resultFunctionInvoke = InvokeFunction(param, user, resource, environment);
                    if (resultFunctionInvoke == null) return null;
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
                            return null;

                        parameters.Add(value.ToString());
                    }
                }
            }

            MethodInfo method = typeof(UserDefinedFunctionFactory).GetMethod(function.FunctionName);
            result = method.Invoke(null, parameters.ToArray()).ToString();

            return result;
        }
    }
}
