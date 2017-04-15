using AttributeBasedAC.Core.JsonAC.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AttributeBasedAC.WebAPI.Controllers
{
    
    public class AccountController : Controller
    {
        private readonly ISubjectRepository _subjectRepository;

        public AccountController(ISubjectRepository subjectRepository)
        {
            _subjectRepository = subjectRepository;
        }

        [HttpGet]
        [Route("api/accounts")]
        public string Get()
        {
            return _subjectRepository.GetAllUsers("User").ToString();
        }
    }
}
