﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.PrivacyDomainFunction
{
    public class DefaultDomainPrivacy : IPluginDomain
    {
        public string Name
        {
            get
            {
                return "DefaultDomainPrivacy";
            }
        }

        public static string Show(string s)
        {
            return s;
        }
        public static string Hide(string s)
        {
            return "";
        }
    }
}
