using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
namespace PhotoForce_API
{
    public class Admin_InOut
    {
        

    }
    public class UserLoginIP
    {
        public UserLoginIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            action = (string)jsonObject.action;
            uid = (Int32)jsonObject.uid;
            sesid = (string)jsonObject.sesid;
            myIP = (string)jsonObject.myIP;
            hostName = (string)jsonObject.hostName;
            usertype = (string)jsonObject.usertype;

        }
        public string action { get; set; }
        public Int32 uid { get; set; }
        public string sesid { get; set; }
        public string myIP { get; set; }
        public string hostName { get; set; }
        public string usertype { get; set; }
    }

    public class LinksPremissionIP
    {
        public LinksPremissionIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            uid = (string)jsonObject.uid;
            usertype = (string)jsonObject.usertype;
            action = (string)jsonObject.action;
        }
        public string uid { get; set; }
        public string usertype { get; set; }
        public string action { get; set; }
    }


    public class UPLinksPremissionIP
    {
        public UPLinksPremissionIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            uid = (string)jsonObject.uid;
            usertype = (string)jsonObject.usertype;
            lids = (string)jsonObject.lids;
            Updatedby = (string)jsonObject.Updatedby;
            sessid = (string)jsonObject.sessid;
        }
        public string uid { get; set; }
        public string usertype { get; set; }
        public string lids { get; set; }
        public string Updatedby { get; set; }
        public string sessid { get; set; }
    }

    public class UsersDataIP
    {
        public UsersDataIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            UserType = (string)jsonObject.UserType;
        }
        public string UserType { get; set; }
    }



    public class UsersloginIP
    {
        public UsersloginIP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);

            utype = (string)jsonObject.utype;
            fromdate = (string)jsonObject.fromdate;
            todate = (string)jsonObject.todate;
            uid = (int)jsonObject.uid;
        }
        public string utype { get; set; }
        public string fromdate { get; set; }
        public string todate { get; set; }
        public int uid { get; set; }
    }

    public class UserDetails
    {
        public Int32 CreatedBy { get; set; }
        public Int32 Uid { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        public string PhoneNo { get; set; }
        public string result { get; set; }
        public string ESI { get; set; }
        public string Aadhar { get; set; }
        public string InCharge { get; set; }
        public string IsAdmin { get; set; }
        public string Address { get; set; }
        public string PF { get; set; }
        public string EmailID { get; set; }
        public string PassWord { get; set; }
        public string Flag { get; set; }
    }
    public class UserCreation
    {
        public Int32 cnt { get; set; }
    }
    public class LinksPremission
    {
        public Int32 Lid { get; set; }
        public Int32 Parent { get; set; }
        public Int32 flag { get; set; }
        public string LinkName { get; set; }
    }
    public class UsersData
    {
        public Int32 uid { get; set; }
        public string Username { get; set; }
    }
    public class Userslogin
    {
        public string ipaddress { get; set; }
        public string username { get; set; }
        public string sesid { get; set; }
        public string sesin { get; set; }
        public string sesout { get; set; }
    }

    public class Unit
    {
        public Int32 Uid { get; set; }
        public Int32 UnitID { get; set; }
        public string UnitName { get; set; }
        public string UnitDescr { get; set; }
        public string Flag { get; set; }
        public string result { get; set; }
        public Int32 CreatedBy { get; set; }
        public Int32 cnt { get; set; }
    }

    public class Items_IP
    {
        public Items_IP(string Info)
        {
            var info = Util.DecryptStringAES(Info);
            var jsonObject = Json.Decode(info);
            Item_Type = (string)jsonObject.Item_Type;
            ID = (string)jsonObject.ID;
            Item_Descr = (string)jsonObject.Item_Descr;
            Unit = (string)jsonObject.Unit;
            ItemName = (string)jsonObject.ItemName;
            CreatedDate = (string)jsonObject.CreatedDate;
            CreatedBy = (string)jsonObject.CreatedBy;
            IsActive = (string)jsonObject.IsActive;
            BranchID = (string)jsonObject.BranchID;
            Type = (string)jsonObject.Type;
        }
        public string ID { get; set; }
        public string Item_Type { get; set; }
        public string Item_Descr { get; set; }
        public string Unit { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string ItemName { get; set; }
        public string Type { get; set; }
        public string BranchID { get; set; }
    }

    
}