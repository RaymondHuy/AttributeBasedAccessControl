using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatabaseGenerator.Model
{
    public class Project
    {
        public string name { get; set; }

        public string language { get; set; }
    }
    public class Leader
    {
        public string name { get; set; }
        public string phone { get; set; }
    }
    public class Department
    {
        public int dept_id { get; set; }

        public string dept_name { get; set; }

        public string location { get; set; }

        public int MyProperty { get; set; }

        public Leader leader { get; set; }

        public Project projects { get; set; }
    }
}
