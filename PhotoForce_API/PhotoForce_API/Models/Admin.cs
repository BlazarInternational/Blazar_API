using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Xml;
using SQLHelper;
using SqlHelp.Library.DataAccessLayer;
using System.Text;
using PhotoForce_API.Models;
namespace PhotoForce_API
{
    public class Admin
    {
        private string oConnectionString = ConfigurationManager.AppSettings["ConnectionStringStag"].ToString();
        public static string CreatedUrl;
        public static string OzSurl;
        public static string Username;
        public static string password;
        public static string mobile;
        public static string send;
        public static string message;
        public static string ozSender;
        public static string ozCdmasender;

        public string GetRandomString(Random rnd, int length, string charPool)
        {
            var rs = new StringBuilder();
            while (length-- > 0)
                rs.Append(charPool[(int)(rnd.NextDouble() * charPool.Length)]);
            return rs.ToString();
        }

        public List<LoginOP> AdminLogin(string Info)
        {
            return SqlHelpers.GetObjects<LoginOP>(Util.Env, CommandFactory.AdminLogin(Info), LoginObjectFactory.LoginItemFactory);
        }
        public List<Util.Result> SessionsInOut(string Info)
        {
            return SqlHelpers.GetObjects<Util.Result>(Util.Env, CommandFactory.SessionsInOut(Info), CommonObjectFactory.resultItemFactory);
        }
        public List<GetLinks> MainLinks(string Info)
        {
            return SqlHelpers.GetObjects<GetLinks>(Util.Env, CommandFactory.MainLinks(Info), CommonObjectFactory.MenuItemFactory);
        }
        public List<UserCreation> CreateOrUpdateUser(Int32 Uid, String Action, string Name, string Mobile, string PF, string ESI,
            string Aadhar, string Email, string Address, string IsInCharge, string IsAdmin, string UserName, string Password, 
            int CreatedBy, String Flag, Int32 LastUpdatedBy, Int32 DeletedBy, string sesid)
        {
            return SqlHelpers.GetObjects<UserCreation>(Util.Env, CommandFactory.CreateOrUpdateUser(Uid, Action, Name, Mobile, PF, ESI, Aadhar, Email, Address, IsInCharge,IsAdmin, UserName, Password, CreatedBy, Flag, LastUpdatedBy, DeletedBy, sesid), AdminObjectFactory.CreateUserItemFactory);
        }
        public List<UserDetails> GetUsers(Int32 Uid, string Action, Int32 DeletedBy)
        {
            if (Action == "Delete" || Action == "Delete1")
                return SqlHelpers.GetObjects<UserDetails>(Util.Env, CommandFactory.GetUsers(Uid, Action, DeletedBy), AdminObjectFactory.DeleteUsersItemFactory);
            else if (Action == "Edit" || Action == "Edit1")
                return SqlHelpers.GetObjects<UserDetails>(Util.Env, CommandFactory.GetUsers(Uid, Action, DeletedBy), AdminObjectFactory.EditUsersItemFactory);
            else
                return SqlHelpers.GetObjects<UserDetails>(Util.Env, CommandFactory.GetUsers(Uid, Action, DeletedBy), AdminObjectFactory.GetUsersItemFactory);
        }
        public List<LinksPremission> LinksPremission(string Info)
        {
            return SqlHelpers.GetObjects<LinksPremission>(Util.Env, CommandFactory.LinksPremission(Info), AdminObjectFactory.LinksPremissionItemFactory);
        }
        public List<Util.Result> UpdateLinksPremission(string Info)
        {
            return SqlHelpers.GetObjects<Util.Result>(Util.Env, CommandFactory.UpdateLinksPremission(Info), CommonObjectFactory.resultItemFactory);
        }
        public List<UsersData> UsersData(string Info)
        {
            return SqlHelpers.GetObjects<UsersData>(Util.Env, CommandFactory.UsersData(Info), AdminObjectFactory.UsersItemFactory);
        }
        public List<Userslogin> UserLoginRpt(string Info)
        {
            return SqlHelpers.GetObjects<Userslogin>(Util.Env, CommandFactory.UserLoginRpt(Info), AdminObjectFactory.GetUserLoginRptItemFactory);
        }

        public List<CheckUserID> CheckUserID(string Info)
        {
            return SqlHelpers.GetObjects<CheckUserID>(Util.Env, CommandFactory.CheckUserID(Info), AdminObjectFactory.CheckUserIDItemFactory);
        }

        public List<Util.Result> ChangePassword(string action, string regid, string thru, string oldpwd, string newpwd)
        {
            return SqlHelpers.GetObjects<Util.Result>(Util.Env, CommandFactory.ChangePassword(action, regid, thru, oldpwd, newpwd), CommonObjectFactory.resultItemFactory);
        }

        public List<Util.Result> UserLogin(string Info)
        {
            return SqlHelpers.GetObjects<Util.Result>(Util.Env, CommandFactory.UserLogin(Info), CommonObjectFactory.resultItemFactory);
        }

        #region "PF"
        public string Import_GetPhotos(OrderDetails obj)
        {   
            string ID = string.Empty;
            try
            {
                SqlParameter[] mSQLPrm = new SqlParameter[6];
                mSQLPrm[0] = new SqlParameter("@id", SqlDbType.VarChar, 100);
                mSQLPrm[0].Value = obj.id;
                mSQLPrm[1] = new SqlParameter("@number", SqlDbType.VarChar, 100);
                mSQLPrm[1].Value = obj.number;
                mSQLPrm[2] = new SqlParameter("@key", SqlDbType.VarChar, 100);
                mSQLPrm[2].Value = obj.key;
                mSQLPrm[3] = new SqlParameter("@job_id", SqlDbType.VarChar, 100);
                mSQLPrm[3].Value = obj.job_id;
                mSQLPrm[4] = new SqlParameter("@payment_method", SqlDbType.VarChar, 100);
                mSQLPrm[4].Value = obj.payment_method;
                mSQLPrm[5] = new SqlParameter("@payment_status", SqlDbType.VarChar, 100);
                mSQLPrm[5].Value = obj.payment_status;

                ID = SqlHelper.ExecuteScalar(oConnectionString, "PF_Import_GetPhotos", mSQLPrm).ToString();
            }
            catch (Exception sqlEx)
            {
                ID = "ExceptionError";

            }

            return ID;
        }

        public string Import_GetPhotos_OrderAmount(OrderAmount obj,string orderID)
        {
            string ID = string.Empty;
            try
            {
                SqlParameter[] mSQLPrm = new SqlParameter[3];
                mSQLPrm[0] = new SqlParameter("@id", SqlDbType.VarChar, 100);
                mSQLPrm[0].Value = orderID;
                mSQLPrm[1] = new SqlParameter("@amount", SqlDbType.VarChar, 100);
                mSQLPrm[1].Value = obj.amount;
                mSQLPrm[2] = new SqlParameter("@currency", SqlDbType.VarChar, 100);
                mSQLPrm[2].Value = obj.currency;

                ID = SqlHelper.ExecuteScalar(oConnectionString, "PF_Insert_GetPhotos_OrderAmount", mSQLPrm).ToString();
            }
            catch (Exception sqlEx)
            {
                ID = "ExceptionError";

            }

            return ID;
        }

        public string Import_GetPhotos_InvoiceAddress(OrderInvoice_Address obj, string orderID)
        {
            string ID = string.Empty;
            try
            {
                SqlParameter[] mSQLPrm = new SqlParameter[12];
                mSQLPrm[0] = new SqlParameter("@id", SqlDbType.VarChar, 100);
                mSQLPrm[0].Value = orderID;
                mSQLPrm[1] = new SqlParameter("@title", SqlDbType.VarChar, 100);
                mSQLPrm[1].Value = obj.title;
                mSQLPrm[2] = new SqlParameter("@first_name", SqlDbType.VarChar, 100);
                mSQLPrm[2].Value = obj.first_name;
                mSQLPrm[3] = new SqlParameter("@last_name", SqlDbType.VarChar, 100);
                mSQLPrm[3].Value = obj.last_name;
                mSQLPrm[4] = new SqlParameter("@company", SqlDbType.VarChar, 100);
                mSQLPrm[4].Value = obj.company;
                mSQLPrm[5] = new SqlParameter("@street1", SqlDbType.VarChar, 100);
                mSQLPrm[5].Value = obj.street1;
                mSQLPrm[6] = new SqlParameter("@street2", SqlDbType.VarChar, 100);
                mSQLPrm[6].Value = obj.street2;
                mSQLPrm[7] = new SqlParameter("@zip", SqlDbType.VarChar, 100);
                mSQLPrm[7].Value = obj.zip;
                mSQLPrm[8] = new SqlParameter("@city", SqlDbType.VarChar, 100);
                mSQLPrm[8].Value = obj.city;
                mSQLPrm[9] = new SqlParameter("@state", SqlDbType.VarChar, 100);
                mSQLPrm[9].Value = obj.state;
                mSQLPrm[10] = new SqlParameter("@country_code", SqlDbType.VarChar, 100);
                mSQLPrm[10].Value = obj.country_code;
                mSQLPrm[11] = new SqlParameter("@created", SqlDbType.VarChar, 100);
                mSQLPrm[11].Value = obj.created;

                ID = SqlHelper.ExecuteScalar(oConnectionString, "PF_Import_GetPhotos_Invoice", mSQLPrm).ToString();
            }
            catch (Exception sqlEx)
            {
                ID = "ExceptionError";

            }

            return ID;
        }

        public string Import_GetPhotos_ShipingAddress(Ordershipping_address obj, string orderID)
        {
            string ID = string.Empty;
            try
            {
                SqlParameter[] mSQLPrm = new SqlParameter[12];
                mSQLPrm[0] = new SqlParameter("@id", SqlDbType.VarChar, 100);
                mSQLPrm[0].Value = orderID;
                mSQLPrm[1] = new SqlParameter("@title", SqlDbType.VarChar, 100);
                mSQLPrm[1].Value = obj.title;
                mSQLPrm[2] = new SqlParameter("@first_name", SqlDbType.VarChar, 100);
                mSQLPrm[2].Value = obj.first_name;
                mSQLPrm[3] = new SqlParameter("@last_name", SqlDbType.VarChar, 100);
                mSQLPrm[3].Value = obj.last_name;
                mSQLPrm[4] = new SqlParameter("@company", SqlDbType.VarChar, 100);
                mSQLPrm[4].Value = obj.company;
                mSQLPrm[5] = new SqlParameter("@street1", SqlDbType.VarChar, 100);
                mSQLPrm[5].Value = obj.street1;
                mSQLPrm[6] = new SqlParameter("@street2", SqlDbType.VarChar, 100);
                mSQLPrm[6].Value = obj.street2;
                mSQLPrm[7] = new SqlParameter("@zip", SqlDbType.VarChar, 100);
                mSQLPrm[7].Value = obj.zip;
                mSQLPrm[8] = new SqlParameter("@city", SqlDbType.VarChar, 100);
                mSQLPrm[8].Value = obj.city;
                mSQLPrm[9] = new SqlParameter("@state", SqlDbType.VarChar, 100);
                mSQLPrm[9].Value = obj.state;
                mSQLPrm[10] = new SqlParameter("@country_code", SqlDbType.VarChar, 100);
                mSQLPrm[10].Value = obj.country_code;
                mSQLPrm[11] = new SqlParameter("@created", SqlDbType.VarChar, 100);
                mSQLPrm[11].Value = obj.created;

                ID = SqlHelper.ExecuteScalar(oConnectionString, "PF_Import_GetPhotos_Shiping", mSQLPrm).ToString();
            }
            catch (Exception sqlEx)
            {
                ID = "ExceptionError";

            }

            return ID;
        }

        public string Import_SimplePhotos_Import(ordered_products obj)
        {
            string ID = string.Empty;
            try
            {
                SqlParameter[] mSQLPrm = new SqlParameter[4];
                mSQLPrm[0] = new SqlParameter("@order_id", SqlDbType.Int, 100);
                mSQLPrm[0].Value = obj.order_id;
                mSQLPrm[1] = new SqlParameter("@image_id", SqlDbType.VarChar, 100);
                mSQLPrm[1].Value = obj.image_id;
                mSQLPrm[2] = new SqlParameter("@billing_code", SqlDbType.VarChar, 100);
                mSQLPrm[2].Value = obj.billing_code;
                mSQLPrm[3] = new SqlParameter("@price", SqlDbType.Int, 100);
                mSQLPrm[3].Value = obj.price;

                ID = SqlHelper.ExecuteScalar(oConnectionString, "PF_Import_SimplePhotos", mSQLPrm).ToString();
            }
            catch (Exception sqlEx)
            {
                ID = "ExceptionError";

            }

            return ID;
        }


        #endregion "PF"

    }
     
}