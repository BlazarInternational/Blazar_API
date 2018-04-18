using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public partial class CommandFactory
    {
        internal static SqlCommand GetPasswords(string action)
        {
            var parameters = new[]
            {  
                CreateParameter("@action", SqlDbType.VarChar, action)  
            };
            return CreateCommand("PF_GetPasswords_SP", parameters);
        }
        internal static SqlCommand PasswordsEncription(string action, string id, string pwd, string encpwd, string tpwd, string enctpwd)
        {
            var parameters = new[]
            {  
                CreateParameter("@action", SqlDbType.VarChar, action)  ,
                CreateParameter("@id", SqlDbType.VarChar, id)  ,
                CreateParameter("@pwd", SqlDbType.VarChar, pwd)  ,
                CreateParameter("@encpwd", SqlDbType.VarChar, encpwd)  ,
                CreateParameter("@tpwd", SqlDbType.VarChar, tpwd)  ,
                CreateParameter("@enctpwd", SqlDbType.VarChar, enctpwd)  
            };
            return CreateCommand("PF_GenerateNewPasswords_SP", parameters);
        }

        internal static SqlCommand GetLastLogin(string Info)
        {
            lastlogin_IP lastlogin = new lastlogin_IP(Info);

            var parameters = new[]
            {
                CreateParameter("@uid", SqlDbType.Int, lastlogin.uid),
                CreateParameter("@utype", SqlDbType.VarChar, lastlogin.usertype)               
            };
            return CreateCommand("PF_LastLogins_SP", parameters);
        }
        internal static SqlCommand Dropdown(string Info)
        {
            GetDropdownIP getdropdown = new GetDropdownIP(Info);

            var parameters = new[]
           {    
               CreateParameter("@Action", SqlDbType.VarChar, getdropdown.Action) ,
               CreateParameter("@Condition", SqlDbType.VarChar, getdropdown.Condition),
               CreateParameter("@ItemID", SqlDbType.Int,getdropdown.ItemID)
           };
            return CreateCommand("PF_GetDropDown_SP", parameters);
        }

        internal static SqlCommand GetValue(string Info)
        {
            GetValueIP getval = new GetValueIP(Info);

            var parameters = new[]
            { 
                CreateParameter("@table", SqlDbType.VarChar, getval.table) ,
                CreateParameter("@RequiredColumn", SqlDbType.VarChar, getval.RequiredColumn) ,
                CreateParameter("@IdColumn", SqlDbType.VarChar, getval.IdColumn) ,
                CreateParameter("@Id", SqlDbType.VarChar, getval.Id)
            };

            return CreateCommand("PF_GetValue", parameters);
        }
        internal static SqlCommand ChangePassword(string action, string regid, string thru, string oldpwd, string newpwd)
        {
            var parameters = new[]
            {                
                CreateParameter("@action", SqlDbType.VarChar, action),
                CreateParameter("@regid", SqlDbType.Int, Convert.ToInt32(regid)),
                CreateParameter("@oldpwd", SqlDbType.VarChar, oldpwd),
                CreateParameter("@newpwd", SqlDbType.VarChar, newpwd),
                CreateParameter("@thru", SqlDbType.VarChar, thru) 
            };
            return CreateCommand("PF_ChangePassword_SP", parameters);
        }
        
    }
}