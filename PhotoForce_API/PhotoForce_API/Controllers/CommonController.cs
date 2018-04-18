using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;
using System.Web.Http;

namespace PhotoForce_API.Controllers
{
    public class CommonController : ApiController
    {

        Admin admin = new Admin();
        Common _objCommon = new Common();
        public class Params
        {
            public string info { get; set; }
        }



        [System.Web.Mvc.HttpGet]
        public List<Passwords_List> GetPasswords(string action)
        {
            return _objCommon.GetPasswords(action);
        }
        [System.Web.Mvc.HttpPost]
        public string PasswordsEncription(string action, string id, string pwd, string tpwd)
        {
            var newpwd = "";
            var newtpwd = "";
            var nri = new Random();
            var pwd1 = _objCommon.GetRandomString(nri, 2, "123456789");
            var pwd2 = _objCommon.GetRandomString(nri, 6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            var pwd3 = _objCommon.GetRandomString(nri, 2, "123456789");
            newpwd = pwd1 + pwd2 + pwd3;

            var tpwd1 = _objCommon.GetRandomString(nri, 2, "123456789");
            var tpwd2 = _objCommon.GetRandomString(nri, 6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            var tpwd3 = _objCommon.GetRandomString(nri, 2, "123456789");
            newtpwd = tpwd1 + tpwd2 + tpwd3;

            return _objCommon.PasswordsEncription(action, id, newpwd, Util.Encrypt(newpwd), newtpwd, Util.Encrypt(newtpwd));
        }

        [System.Web.Mvc.HttpPost]
        public List<lastlogin> LastLogin([FromBody]Params Info)
        {
            return _objCommon.GetLastLogin(Info.info);
        }

       

        //[System.Web.Mvc.HttpPost]
        //public string Exist([FromBody]Params Info)
        //{
        //    return _objCommon.Exist(Info.info);
        //}
        [AcceptVerbs("POST")]
        [ActionName("GetValue")]
        public string GetValue([FromBody]Params Info)
        {
            return _objCommon.GetValue(Info.info);
        }
       
        [System.Web.Mvc.HttpGet]
        public string EncriptValues(string value)
        {
            return Util.Encrypt(value);
        }
       
        [System.Web.Mvc.HttpPost]
        public List<Util.Result> ChangePassword(string action, string Idno, string Name, string Mobile, string regid, string thru, string opwd, string npwd, string sessid)
        {
            var newpwd = "";
            if (action == "ResetMemLogin" || action == "ResetMemTran" || action == "ResetUserLogin" || action == "ResetStoresLogin")
            {
                newpwd = Mobile;
            }
            else
            {
                newpwd = npwd;
            }

            return _objCommon.ChangePassword(action, regid, thru, Util.Encrypt(opwd ?? ""), Util.Encrypt(newpwd));
        }
    }
}
