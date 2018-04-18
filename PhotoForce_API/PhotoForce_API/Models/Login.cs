using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace PhotoForce_API
{
    public class LoginOP
    {
        public Int32 Loginid { get; set; }
        public string Username { get; set; }
        public string Result { get; set; }
        public Int32 IsAdmin { get; set; }
    }
    public class LoginIP
    {
        public LoginIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            username = (string)jsonObject.username;
            password = (string)jsonObject.password;
        }
        public string username { get; set; }
        public string password { get; set; }
    }
    public class SessionsInOutIP
    {
        public SessionsInOutIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            action = (string)jsonObject.action;
            loginid = (string)jsonObject.loginid;
            usertype = (string)jsonObject.usertype;
            sesid = (string)jsonObject.sesid;
        }
        public string action { get; set; }
        public string loginid { get; set; }
        public string usertype { get; set; }
        public string sesid { get; set; }
    }
    public class SFLoginIP
    {
        public SFLoginIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            FCode = (string)jsonObject.FCode;
            username = (string)jsonObject.username;
            password = (string)jsonObject.password;
        }
        public string FCode { get; set; }
        public string username { get; set; }
        public string password { get; set; }

    }
    public class FLoginIP
    {
        public FLoginIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            FCode = (string)jsonObject.FCode;
            username = (string)jsonObject.username;
            password = (string)jsonObject.password;
        }
        public string FCode { get; set; }
        public string username { get; set; }
        public string password { get; set; }

    }
   



    //Manish Added
    public class CheckUserID
    {
        public Int32 regid { get; set; }
        public string result { get; set; }
    }

    public class CheckUserIDIP
    {
        public CheckUserIDIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            action = (string)jsonObject.action;
            idno = (string)jsonObject.idno;
        }
        public string action { get; set; }
        public string idno { get; set; }
    }
    
   
}