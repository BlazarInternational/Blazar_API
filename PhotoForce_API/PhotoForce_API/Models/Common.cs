using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Xml;

namespace PhotoForce_API
{
    public class Common
    {
        public string GetRandomString(Random rnd, int length, string charPool)
        {
            var rs = new StringBuilder();
            while (length-- > 0)
                rs.Append(charPool[(int)(rnd.NextDouble() * charPool.Length)]);
            return rs.ToString();
        }

        public List<Passwords_List> GetPasswords(string action)
        {
            return SqlHelpers.GetObjects<Passwords_List>(Util.Env, CommandFactory.GetPasswords(action), CommonObjectFactory.PasswordsItemFactory);
        }
        public string PasswordsEncription(string action, string id, string pwd, string encpwd, string tpwd, string enctpwd)
        {
            return SqlHelpers.GetObjects(Util.Env, CommandFactory.PasswordsEncription(action, id, pwd, encpwd, tpwd, enctpwd));
        }

        public List<lastlogin> GetLastLogin(string Info)
        {
            return SqlHelpers.GetObjects<lastlogin>(Util.Env, CommandFactory.GetLastLogin(Info), CommonObjectFactory.GetLastLoginItemFactory);
        }
        public List<DropdownIP> Dropdown(string Info)
        {
            return SqlHelpers.GetObjects<DropdownIP>(Util.Env, CommandFactory.Dropdown(Info), CommonObjectFactory.DropdownItemFactory);
        }

        public string GetValue(string Info)
        {
            return SqlHelpers.GetObjects(Util.Env, CommandFactory.GetValue(Info));
        }

        public List<Util.Result> ChangePassword(string action, string regid, string thru, string oldpwd, string newpwd)
        {
            return SqlHelpers.GetObjects<Util.Result>(Util.Env, CommandFactory.ChangePassword(action, regid, thru, oldpwd, newpwd), CommonObjectFactory.resultItemFactory);
        }

    }


    public class GetLinks
    {
        public Int32 Lid { get; set; }
        public string LinkName { get; set; }
        public string Pagename { get; set; }
        public string DispPage { get; set; }
        public Int32 Parent { get; set; }
        public Int32 sorting { get; set; }
    }
    public class GetLinksIP
    {
        public GetLinksIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            action = (string)jsonObject.action;
            Id = (string)jsonObject.Id;
        }
        public string action { get; set; }
        public string Id { get; set; }
    }
    public class CreateOrUpdateUserIP
    {
        public CreateOrUpdateUserIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            Uid = (Int32)jsonObject.Uid;
            Action = (string)jsonObject.Action;
            Name = (string)jsonObject.Name;
            DoorNo = (string)jsonObject.DoorNo;
            Lane = (string)jsonObject.Lane;
            Street = (string)jsonObject.Street;
            City = (string)jsonObject.City;
            State = (string)jsonObject.State;
            Email = (string)jsonObject.Email;
            Mobile = (string)jsonObject.Mobile;
            UserName = (string)jsonObject.UserName;
            Password = (string)jsonObject.Password;
            CreatedBy = (Int32)jsonObject.CreatedBy;
            Flag = (string)jsonObject.Flag;
            LastUpdatedBy = (Int32)jsonObject.LastUpdatedBy;
            DeletedBy = (Int32)jsonObject.DeletedBy;
            sesid = (string)jsonObject.sesid;

        }
        public Int32 Uid { get; set; }
        public string Action { get; set; }
        public string Name { get; set; }
        public string DoorNo { get; set; }
        public string Lane { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public Int32 CreatedBy { get; set; }
        public string Flag { get; set; }
        public Int32 LastUpdatedBy { get; set; }
        public Int32 DeletedBy { get; set; }
        public string sesid { get; set; }
    }

    public class lastlogin_IP
    {
        public lastlogin_IP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            uid = (string)jsonObject.uid;
            usertype = (string)jsonObject.usertype;
        }
        public string uid { get; set; }
        public string usertype { get; set; }
    }
    public class lastlogin
    {
        public string Designation { get; set; }
        public string Name { get; set; }
        public string username { get; set; }
        public string llogin { get; set; }
    }

    public class DropdownIP
    {
        public int Value { get; set; }
        public string Text { get; set; }
    }
    public class GetDropdownIP
    {
        public GetDropdownIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            Action = (string)jsonObject.Action;
            Condition = (string)jsonObject.Condition;
            ItemID = (Int32)jsonObject.ItemID;
        }
        public string Action { get; set; }
        public string Condition { get; set; }
        public Int32 ItemID { get; set; }
    }
    public class Passwords_List
    {
        public Int32 id { get; set; }
        public string pwd { get; set; }
        public string tpwd { get; set; }
    }
    public class GetValueIP
    {
        public GetValueIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            table = (string)jsonObject.table;
            RequiredColumn = (string)jsonObject.RequiredColumn;
            IdColumn = (string)jsonObject.IdColumn;
            Id = (string)jsonObject.Id;
        }

        public string table { get; set; }
        public string RequiredColumn { get; set; }
        public string IdColumn { get; set; }
        public string Id { get; set; }
    }

   
}