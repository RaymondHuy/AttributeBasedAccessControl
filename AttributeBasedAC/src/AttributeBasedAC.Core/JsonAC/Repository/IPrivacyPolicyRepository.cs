﻿using AttributeBasedAC.Core.JsonAC.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.Core.JsonAC.Repository
{
    public interface IPrivacyPolicyRepository
    {
        ICollection<PrivacyPolicy> GetAll();

        ICollection<PrivacyPolicy> GetPolicies(string collectionName, bool? isAttributeResourceRequired);

        void Add(PrivacyPolicy privacyPolicy);

        PrivacyPolicy GetPolicy(string policyID);

        void Delete(string policyID);

        ICollection<string> GetArrayFieldName();

    }
}
