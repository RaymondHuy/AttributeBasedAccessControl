using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.NewtonsoftExtension
{
    public static class JObjectExtension
    {
        public static void AddNewFieldFromPath(this JObject jObject, string pathField, JObject rawObject)
        {
            string[] nestedFields = pathField.Split(new char[] { '.'});
            string pathFieldCur = nestedFields[0];

            var jObjectCur = jObject;

            for (int i = 0; i < nestedFields.Length; i++)
            {
                string field = nestedFields[i];

                if (rawObject.SelectToken(pathFieldCur) is JArray)
                {
                    if (jObjectCur[field] == null)
                        jObjectCur[field] = new JArray();

                    var array = (JArray)rawObject.SelectToken(pathFieldCur);
                    int currentIndex = 0;
                    foreach (var token in array)
                    {
                        JObject element = (JObject)token;
                        string pathObject = pathFieldCur + "[" + currentIndex + "]";
                        string pathRemaining = String.Empty;
                        for (int j = i + 1; j < nestedFields.Length; j++)
                        {
                            pathRemaining += nestedFields[j];
                        }
                        element.AddNewFieldFromPath(pathRemaining, (JObject)rawObject.SelectToken(pathObject));
                        ++currentIndex;
                    }
                    break;
                }

                if (jObjectCur[field] == null)
                    jObjectCur[field] = new JObject();

                if (i != nestedFields.Length - 1)
                    jObjectCur = (JObject)jObjectCur[field];

                pathFieldCur += "." + field;
            }
            string lastField = nestedFields.Last();
            //jObjectCur[lastField] = value;
        }
    }
}
