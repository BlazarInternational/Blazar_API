using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public class LoginObjectFactory
    {
        internal static LoginOP LoginItemFactory(SqlDataReader reader)
        {
            LoginOP menuItem = new LoginOP();

            menuItem.Loginid = (Int32)reader["Loginid"];

            if (Convert.IsDBNull(reader["Username"]))
                menuItem.Username = null;
            else
                menuItem.Username = (string)reader["Username"];

            if (Convert.IsDBNull(reader["Result"]))
                menuItem.Result = null;
            else
                menuItem.Result = (string)reader["Result"];

                menuItem.IsAdmin = (Int32)reader["IsAdmin"];


            return menuItem;
        }
    }
}