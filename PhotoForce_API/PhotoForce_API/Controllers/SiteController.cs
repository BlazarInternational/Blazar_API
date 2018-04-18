
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Xml;
using System.Xml.Xsl;
using System.Xml.Linq;
using System.Text;
using PhotoForce_API.Models;
using PhotoForce_API.Services;
namespace PhotoForce_API.Controllers
{
    public class SiteController : FileUploadController
    {
        Admin admin = new Admin();
        Common _objCommon = new Common();
        static readonly IServerDataRestClient RestClient = new ServerDataRestClient();
        public class Params
        {
            public string info { get; set; }
        }

        [System.Web.Mvc.HttpPost]
        public List<DropdownIP> Dropdown([FromBody]Params Info)
        {
            return _objCommon.Dropdown(Info.info);
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
    

        [System.Web.Mvc.HttpPost]
        public List<GetLinks> MainLinks([FromBody]Params Info)
        {
            return admin.MainLinks(Info.info);
        }


        [System.Web.Mvc.HttpPost]
        public List<UserCreation> CreateOrUpdateUser(Int32 Uid, String Action, string Name, string Mobile, string PF, string ESI,
            string Aadhar, string Email, string Address, string IsInCharge, string IsAdmin, string UserName, string Password, int CreatedBy, String Flag, Int32 LastUpdatedBy, Int32 DeletedBy, string sesid)
        {
            return admin.CreateOrUpdateUser(Uid, Action, Name, Mobile, PF, ESI,Aadhar, Email,  Address, IsInCharge,IsAdmin, UserName, Password == null ? "" : Util.Encrypt(Password), CreatedBy, Flag, LastUpdatedBy, DeletedBy, sesid);
        }

        [System.Web.Mvc.HttpGet]
        public List<UserDetails> GetUsers(Int32 Uid, string Action, Int32 DeletedBy)
        {
            return admin.GetUsers(Uid, Action, DeletedBy);
        }

        [System.Web.Mvc.HttpPost]
        public List<LinksPremission> LinksPremission([FromBody]Params Info)
        {
            return admin.LinksPremission(Info.info);
        }
        [System.Web.Mvc.HttpPost]
        public List<Util.Result> UpdateLinksPremission([FromBody]Params Info)
        {
            return admin.UpdateLinksPremission(Info.info);
        }

        [System.Web.Mvc.HttpPost]
        public List<Userslogin> UserLoginRpt([FromBody]Params Info)
        {
            return admin.UserLoginRpt(Info.info);
        }

        [System.Web.Mvc.HttpPost]
        public List<CheckUserID> CheckUserID([FromBody]Params Info)
        {
            return admin.CheckUserID(Info.info);
        }

        [System.Web.Mvc.HttpPost]
        public List<Util.Result> UserLogin([FromBody]Params Info)
        {
            return admin.UserLogin(Info.info);
        }


        //[System.Web.Mvc.HttpPost]
        //public List<Util.Result> ChangePassword(string action, string Idno, string Name, string Mobile, string regid, string thru, string opwd, string npwd, string sessid)
        //{
        //    var newpwd = "";
        //    if (action == "ResetMemLogin" || action == "ResetMemTran" || action == "ResetUserLogin" || action == "ResetStoresLogin")
        //    {
        //        var nri = new Random();
        //        var pwd1 = admin.GetRandomString(nri, 2, "1234567890");
        //        var pwd2 = admin.GetRandomString(nri, 6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        //        var pwd3 = admin.GetRandomString(nri, 2, "1234567890");
        //        newpwd = pwd2;
        //    }
        //    else
        //    {
        //        newpwd = npwd;
        //    }
           
        //    return admin.ChangePassword(action, regid, thru, Util.Encrypt(opwd ?? ""), Util.Encrypt(newpwd));
        //}

        public string GetRandomString(Random rnd, int length, string charPool)
        {
            var rs = new StringBuilder();
            while (length-- > 0)
                rs.Append(charPool[(int)(rnd.NextDouble() * charPool.Length)]);
            return rs.ToString();
        }


      

        #region "PF Orders"

        [System.Web.Mvc.HttpGet]
        public List<OrderDetails> GetPhotos()
        {
            return RestClient.GetPhotos();
        }

        [System.Web.Mvc.HttpGet]
        public sampleorders GetSimplePhotos(string fromdate, string todate)
        {
            return RestClient.GetSimplePhotos(fromdate, todate);
        }

        [System.Web.Mvc.HttpGet]
        public List<OrderDetails> GetPhotos_Import()
        {
            List<OrderDetails> list =new List<OrderDetails>();
            list = RestClient.GetPhotos();
            foreach (OrderDetails row in list)
            {
                admin.Import_GetPhotos(row);
                admin.Import_GetPhotos_OrderAmount(row.amount,row.id);
                admin.Import_GetPhotos_InvoiceAddress(row.invoice_address, row.id);
                admin.Import_GetPhotos_ShipingAddress(row.shipping_address, row.id);
            }
            
            return list;
        }

        [System.Web.Mvc.HttpGet]
        public sampleorders GetSimplePhotos_Import(string fromdate, string todate)
        {
            sampleorders list = new sampleorders();
            list = RestClient.GetSimplePhotos(fromdate, todate);

            foreach (ordered_products row in list.ordered_products)
            {
                admin.Import_SimplePhotos_Import(row);
            }
            return list;
        }


        #endregion "PF Orders"

    }
}
