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
            var nestedFields = pathField.Split(new char[] { '.' });
            jObject.AddNewFieldFromPath(rawObject, nestedFields, 0);
        }
        private static void AddNewFieldFromPath(this JObject privacyObject, JObject rawObject, string[] pathField, int startIndex)
        {
            var field = pathField[startIndex];
            var token = rawObject.SelectToken(field);

            if (token is JArray)
            {
                privacyObject[field] = privacyObject[field] ?? new JArray();

                var rawArray = (JArray)rawObject.SelectToken(field);
                var privacyArray = (JArray)privacyObject.SelectToken(field);
                int currentIndex = 0;

                foreach (var element in rawArray)
                {
                    var nextRawObject = (JObject)element;
                    var pathIndexObject = field + "[" + currentIndex + "]";

                    if (privacyObject.SelectToken(pathIndexObject) == null)
                        privacyArray.Add(new JObject());

                    var nextPrivacyObject = (JObject)privacyObject.SelectToken(pathIndexObject);
                    nextPrivacyObject.AddNewFieldFromPath(nextRawObject, pathField, startIndex + 1);

                    ++currentIndex;
                }
            }
            else if (token is JObject)
            {
                privacyObject[field] = privacyObject[field] ?? new JObject();

                var nextPrivacyObject = (JObject)privacyObject[field];
                var nextRawObject = (JObject)rawObject[field];

                nextPrivacyObject.AddNewFieldFromPath(nextRawObject, pathField, startIndex + 1);
            }
            else privacyObject[field] = rawObject[field];
        }
    }
}
