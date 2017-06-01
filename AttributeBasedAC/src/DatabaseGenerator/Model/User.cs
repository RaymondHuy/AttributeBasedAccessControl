using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator.Model
{
    public class User
    {
        public string access_token { get; set; }

        public string role { get; set; }

        public string name { get; set; }

        public bool active { get; set; }

        public string country { get; set; }

        public string univeristy { get; set; }

        public int[] GPA { get; set; }

        public string department { get; set; }
    }
}
