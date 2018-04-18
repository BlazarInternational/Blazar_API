using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using System.Web.SessionState;

namespace PhotoForce_API.Controllers
{
    public class AdminLoginController : ApiController
    {
        Admin admin = new Admin();

        public class Params
        {
            public string info { get; set; }
        }
        [System.Web.Mvc.HttpPost]
        public void SendErrorMessage(string subject, string error)
        {
            Util.SendErrorMail(subject, error);
        }
        [System.Web.Mvc.HttpPost]
        public List<LoginOP> AdminLogin([FromBody]Params Info)
        {
            return admin.AdminLogin(Info.info);
        }
        [System.Web.Mvc.HttpPost]
        public List<Util.Result> SessionsInOut([FromBody]Params Info)
        {
            return admin.SessionsInOut(Info.info);
        }
    }
}
