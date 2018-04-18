using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public class AdminObjectFactory
    {
        internal static UserCreation CreateUserItemFactory(SqlDataReader reader)
        {
            UserCreation Items = new UserCreation();
            Items.cnt = (Int32)reader["cnt"];
            return Items;
        }
        internal static LinksPremission LinksPremissionItemFactory(SqlDataReader reader)
        {
            LinksPremission Items = new LinksPremission();

            Items.Lid = (Int32)reader["Lid"];
            Items.Parent = (Int32)reader["Parent"];
            Items.flag = (Int32)reader["flag"];

            if (Convert.IsDBNull(reader["LinkName"]))
                Items.LinkName = null;
            else
                Items.LinkName = (string)reader["LinkName"];

            return Items;
        }
        internal static UsersData UsersItemFactory(SqlDataReader reader)
        {
            UsersData Items = new UsersData();
            Items.uid = (Int32)reader["uid"];
            if (Convert.IsDBNull(reader["Username"]))
                Items.Username = null;
            else
                Items.Username = (string)reader["Username"];
            return Items;
        }
        internal static Userslogin GetUserLoginRptItemFactory(SqlDataReader reader)
        {
            Userslogin Items = new Userslogin();
            if (Convert.IsDBNull(reader["ipaddress"]))
                Items.ipaddress = null;
            else
                Items.ipaddress = (string)reader["ipaddress"];
            if (Convert.IsDBNull(reader["username"]))
                Items.username = null;
            else
                Items.username = (string)reader["username"];

            if (Convert.IsDBNull(reader["sesid"]))
                Items.sesid = null;
            else
                Items.sesid = (string)reader["sesid"];

            if (Convert.IsDBNull(reader["sesin"]))
                Items.sesin = null;
            else
                Items.sesin = (string)reader["sesin"];
            if (Convert.IsDBNull(reader["sesout"]))
                Items.sesout = null;
            else
                Items.sesout = (string)reader["sesout"];

            return Items;
        }
        internal static UserDetails DeleteUsersItemFactory(SqlDataReader reader)
        {
            UserDetails Items = new UserDetails();
            if (Convert.IsDBNull(reader["result"]))
                Items.result = null;
            else
                Items.result = (string)reader["result"];

            return Items;
        }
        internal static UserDetails EditUsersItemFactory(SqlDataReader reader)
        {
            UserDetails Items = new UserDetails();

            Items.Uid = (Int32)reader["Uid"];

            if (Convert.IsDBNull(reader["Flag"]))
                Items.Flag = null;
            else
                Items.Flag = (string)reader["Flag"];

            if (Convert.IsDBNull(reader["Name"]))
                Items.Name = null;
            else
                Items.Name = (string)reader["Name"];

            if (Convert.IsDBNull(reader["PF"]))
                Items.PF = null;
            else
                Items.PF = (string)reader["PF"];
            if (Convert.IsDBNull(reader["ESI"]))
                Items.ESI = null;
            else
                Items.ESI = (string)reader["ESI"];

            if (Convert.IsDBNull(reader["PhoneNo"]))
                Items.PhoneNo = null;
            else
                Items.PhoneNo = (string)reader["PhoneNo"];

            if (Convert.IsDBNull(reader["Address"]))
                Items.Address = null;
            else
                Items.Address = (string)reader["Address"];

            if (Convert.IsDBNull(reader["Aadhar"]))
                Items.Aadhar = null;
            else
                Items.Aadhar = (string)reader["Aadhar"];

            if (Convert.IsDBNull(reader["EmailID"]))
                Items.EmailID = null;
            else
                Items.EmailID = (string)reader["EmailID"];

            if (Convert.IsDBNull(reader["UserName"]))
                Items.UserName = null;
            else
                Items.UserName = (string)reader["UserName"];


            if (Convert.IsDBNull(reader["InCharge"]))
                Items.InCharge = null;
            else
                Items.InCharge = (string)reader["InCharge"];

            if (Convert.IsDBNull(reader["IsAdmin"]))
                Items.IsAdmin = null;
            else
                Items.IsAdmin = (string)reader["IsAdmin"];

            return Items;
        }
        internal static UserDetails GetUsersItemFactory(SqlDataReader reader)
        {
            UserDetails Items = new UserDetails();
            Items.Uid = (Int32)reader["Uid"];
            if (Convert.IsDBNull(reader["Flag"]))
                Items.Flag = null;
            else
                Items.Flag = (string)reader["Flag"];

            if (Convert.IsDBNull(reader["UserName"]))
                Items.UserName = null;
            else
                Items.UserName = (string)reader["UserName"];

            if (Convert.IsDBNull(reader["Name"]))
                Items.Name = null;
            else
                Items.Name = (string)reader["Name"];

            if (Convert.IsDBNull(reader["PhoneNo"]))
                Items.PhoneNo = null;
            else
                Items.PhoneNo = (string)reader["PhoneNo"];

            if (Convert.IsDBNull(reader["EmailID"]))
                Items.EmailID = null;
            else
                Items.EmailID = (string)reader["EmailID"];

            if (Convert.IsDBNull(reader["Address"]))
                Items.Address = null;
            else
                Items.Address = (string)reader["Address"];

            if (Convert.IsDBNull(reader["PF"]))
                Items.PF = null;
            else
                Items.PF = (string)reader["PF"];

            if (Convert.IsDBNull(reader["ESI"]))
                Items.ESI = null;
            else
                Items.ESI = (string)reader["ESI"];

            if (Convert.IsDBNull(reader["Aadhar"]))
                Items.Aadhar = null;
            else
                Items.Aadhar = (string)reader["Aadhar"];

            if (Convert.IsDBNull(reader["InCharge"]))
                Items.InCharge = null;
            else
                Items.InCharge = (string)reader["InCharge"];

            if (Convert.IsDBNull(reader["IsAdmin"]))
                Items.IsAdmin = null;
            else
                Items.IsAdmin = (string)reader["IsAdmin"];
            return Items;
        }
        internal static CheckUserID CheckUserIDItemFactory(SqlDataReader reader)
        {
            CheckUserID Items = new CheckUserID();

            Items.regid = (Int32)reader["regid"];

            if (Convert.IsDBNull(reader["result"]))
                Items.result = null;
            else
                Items.result = (string)reader["result"];

            return Items;
        }
    

    }
}