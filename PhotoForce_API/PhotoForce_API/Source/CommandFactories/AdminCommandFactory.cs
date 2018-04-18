using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Helpers;

namespace PhotoForce_API
{
    public partial class CommandFactory
    {
        internal static SqlCommand AdminLogin(string Info)
        {
            LoginIP login = new LoginIP(Info);
            var parameters = new[] 
            {
                CreateParameter("@username", SqlDbType.VarChar, login.username),   
                CreateParameter("@password", SqlDbType.VarChar, Util.Encrypt(login.password))                                
            };
            return CreateCommand("PF_AdminLogin_SP", parameters);
        }
        internal static SqlCommand SessionsInOut(string Info)
        {
            SessionsInOutIP sessions = new SessionsInOutIP(Info);
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST
            // Get the IP
            string myIP = Util.GetIPAddress();//Dns.GetHostByName(hostName).AddressList[0].ToString();
            var parameters = new[]
            {
                CreateParameter("@action", SqlDbType.VarChar, sessions.action),
                CreateParameter("@loginid", SqlDbType.Int, sessions.loginid),
                CreateParameter("@sesid", SqlDbType.VarChar, sessions.sesid),
                CreateParameter("@ipaddress", SqlDbType.VarChar, myIP),
                CreateParameter("@systemname", SqlDbType.VarChar, hostName),
                CreateParameter("@usertype", SqlDbType.VarChar, sessions.usertype),                                           
            };

            return CreateCommand("PF_SessionsInOut_SP", parameters);
        }
        internal static SqlCommand MainLinks(string Info)
        {
            GetLinksIP getlinks = new GetLinksIP(Info);
            var parameters = new[]
            {
                CreateParameter("@action", SqlDbType.VarChar, getlinks.action) ,               
                CreateParameter("@Id", SqlDbType.VarChar, getlinks.Id)                
            };
            return CreateCommand("PF_GetLinks_SP", parameters);
        }
        internal static SqlCommand CreateOrUpdateUser(Int32 Uid, String Action, string Name, string Mobile, string PF, string ESI,
            string Aadhar, string Email, string Address, string IsInCharge, string IsAdmin, string UserName, string Password,
            int CreatedBy, String Flag, Int32 LastUpdatedBy, Int32 DeletedBy, string sesid)
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }

            var parameters = new[]
            {  
                CreateParameter("@Uid", SqlDbType.Int,Convert.ToInt32(Uid)),
                CreateParameter("@Action", SqlDbType.VarChar,Action),                             
                CreateParameter("@Name", SqlDbType.VarChar,Name) ,     
                CreateParameter("@Mobile", SqlDbType.VarChar,Mobile),
                CreateParameter("@PF", SqlDbType.VarChar,PF),
                CreateParameter("@ESI", SqlDbType.VarChar,ESI),
                CreateParameter("@Aadhar", SqlDbType.VarChar,Aadhar),
                CreateParameter("@Email", SqlDbType.VarChar, Email),
                CreateParameter("@Address", SqlDbType.VarChar, Address),
                CreateParameter("@IsInCharge", SqlDbType.VarChar, IsInCharge),
                CreateParameter("@IsAdmin", SqlDbType.VarChar, IsAdmin),
                CreateParameter("@UserName", SqlDbType.VarChar, UserName),
                CreateParameter("@PassWord", SqlDbType.VarChar, Password),
                CreateParameter("@CreatedBy", SqlDbType.Int, Convert.ToInt32(CreatedBy)),                
                CreateParameter("@sesid",SqlDbType.VarChar, sesid),
                CreateParameter("@Ipaddress",SqlDbType.VarChar,ip),
                CreateParameter("@Flag",SqlDbType.VarChar,Flag),
                CreateParameter("@LastUpdatedby",SqlDbType.Int,Convert.ToInt32(LastUpdatedBy)),
                CreateParameter("@Deletedby",SqlDbType.Int,Convert.ToInt32(DeletedBy))

                
            };
            return CreateCommand("PF_INUPDATEUsers_SP", parameters);
        }


        internal static SqlCommand GetUsers(Int32 Uid, string Action, Int32 DeletedBy)
        {
            var parameters = new[]
            {
                 CreateParameter("@Uid", SqlDbType.VarChar, Uid) ,
                 CreateParameter("@Action", SqlDbType.VarChar, Action),
                 CreateParameter("@DeletedBy", SqlDbType.Int,Convert.ToInt32(DeletedBy)),
            };
            return CreateCommand("PF_UsersReport_Sp", parameters);
        }

        internal static SqlCommand LinksPremission(string Info)
        {
            LinksPremissionIP linksPremission = new LinksPremissionIP(Info);
            var parameters = new[]
            {
                CreateParameter("@action", SqlDbType.VarChar, linksPremission.action ) ,             
                CreateParameter("@uid", SqlDbType.VarChar, linksPremission.uid),
                CreateParameter("@usertype", SqlDbType.VarChar, linksPremission.usertype )               
            };
            return CreateCommand("PF_LinksPremission_SP", parameters);
        }
        internal static SqlCommand UpdateLinksPremission(string Info)
        {
            UPLinksPremissionIP upLinksPremission = new UPLinksPremissionIP(Info);
            var parameters = new[]
            {
                CreateParameter("@uid", SqlDbType.VarChar, upLinksPremission.uid),
                CreateParameter("@usertype", SqlDbType.VarChar, upLinksPremission.usertype ) ,
                CreateParameter("@lids", SqlDbType.VarChar, upLinksPremission.lids ) ,
                CreateParameter("@Updatedby", SqlDbType.VarChar, upLinksPremission.Updatedby ) ,
                CreateParameter("@sessid", SqlDbType.VarChar, upLinksPremission.sessid )            
            };
            return CreateCommand("PF_UpdateLinksPremission_SP", parameters);
        }
        internal static SqlCommand UsersData(string Info)
        {
            UsersDataIP usersData = new UsersDataIP(Info);
            var parameters = new[]
            {
                CreateParameter("@UserType", SqlDbType.VarChar, usersData.UserType),
            };
            return CreateCommand("PF_GetUserByUsertype_Sp", parameters);
        }
        internal static SqlCommand UserLoginRpt(string Info)
        {
            UsersloginIP userslogin = new UsersloginIP(Info);
            var parameters = new[]
            {
                CreateParameter("@utype", SqlDbType.VarChar, userslogin.utype),
                CreateParameter("@fromdate", SqlDbType.VarChar, userslogin.fromdate),
                CreateParameter("@todate", SqlDbType.VarChar, userslogin.todate),
                CreateParameter("@uid", SqlDbType.Int, userslogin.uid)              
            };
            return CreateCommand("PF_GetUsersLogin_Sp", parameters);
        }
        internal static SqlCommand CheckUserID(string Info)
        {
            CheckUserIDIP CheckUserID = new CheckUserIDIP(Info);
            var parameters = new[]
            {
                CreateParameter("@action", SqlDbType.VarChar, CheckUserID.action) ,               
                CreateParameter("@idno", SqlDbType.VarChar, CheckUserID.idno)                
            };
            return CreateCommand("PF_CheckUserID_Sp", parameters);
        }
        internal static SqlCommand UserLogin(string Info)
        {
            UserLoginIP UserLogin = new UserLoginIP(Info);
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST
            // Get the IP
            string myIP = GetIPAddress();//Dns.GetHostByName(hostName).AddressList[0].ToString();
            var parameters = new[]
            {
                CreateParameter("@action", SqlDbType.VarChar, UserLogin.action),
                CreateParameter("@uid", SqlDbType.Int, UserLogin.uid),
                CreateParameter("@sesid", SqlDbType.VarChar, UserLogin.sesid),
                CreateParameter("@ipaddress", SqlDbType.VarChar, UserLogin.myIP),
                CreateParameter("@systemname", SqlDbType.VarChar, UserLogin.hostName),
                CreateParameter("@usertype", SqlDbType.VarChar, UserLogin.usertype),                                           
            };

            return CreateCommand("PF_Userlogin_SP", parameters);
        }

        private static string GetIPAddress()
        {
            System.Web.HttpContext context = System.Web.HttpContext.Current;
            string ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }
            return context.Request.ServerVariables["REMOTE_ADDR"];
        }

        internal static SqlCommand CreateOrUpdateUnit(Int32 Unitid, string Action, string UnitName, string UnitDescr, Int32 CreatedBy, String Flag, Int32 LastUpdatedBy, Int32 DeletedBy, string sesid)
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }

            var parameters = new[]
            {  
                CreateParameter("@Unitid", SqlDbType.Int,Convert.ToInt32(Unitid)),
                CreateParameter("@Action", SqlDbType.VarChar,Action),  
                CreateParameter("@UnitName", SqlDbType.VarChar,UnitName),                             
                CreateParameter("@UnitDescr", SqlDbType.VarChar,UnitDescr) ,              
                CreateParameter("@CreatedBy", SqlDbType.Int, Convert.ToInt32(CreatedBy)),                
                CreateParameter("@sesid",SqlDbType.VarChar, sesid),
                CreateParameter("@Ipaddress",SqlDbType.VarChar,ip),
                CreateParameter("@Flag",SqlDbType.VarChar,Flag),
                CreateParameter("@LastUpdatedby",SqlDbType.Int,Convert.ToInt32(LastUpdatedBy)),
                CreateParameter("@Deletedby",SqlDbType.Int,Convert.ToInt32(DeletedBy))
            };
            return CreateCommand("PF_INUPDATE_Unit_SP", parameters);
        }


        internal static SqlCommand GetUnits(Int32 Unitid, string Action, Int32 DeletedBy)
        {
            var parameters = new[]
            {
                 CreateParameter("@Unitid", SqlDbType.Int, Unitid) ,
                 CreateParameter("@Action", SqlDbType.VarChar, Action),
                 CreateParameter("@DeletedBy", SqlDbType.Int,Convert.ToInt32(DeletedBy)),
            };
            return CreateCommand("PF_UnitsReport_Sp", parameters);
        }
        
       


    }
}