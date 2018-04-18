using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API 
{
    public class CommonObjectFactory
    {
        internal static Passwords_List PasswordsItemFactory(SqlDataReader reader)
        {
            Passwords_List Item = new Passwords_List();

            Item.id = (Int32)reader["id"];

            if (Convert.IsDBNull(reader["pwd"]))
                Item.pwd = null;
            else
                Item.pwd = (string)reader["pwd"];

            if (Convert.IsDBNull(reader["tpwd"]))
                Item.tpwd = null;
            else
                Item.tpwd = (string)reader["tpwd"];

            return Item;
        }
        internal static GetLinks MenuItemFactory(SqlDataReader reader)
        {
            GetLinks menuItem = new GetLinks();

            menuItem.Lid = (Int32)reader["Lid"];
            if (Convert.IsDBNull(reader["LinkName"]))
                menuItem.LinkName = null;
            else
                menuItem.LinkName = (string)reader["LinkName"];

            if (Convert.IsDBNull(reader["Pagename"]))
                menuItem.Pagename = null;
            else
                menuItem.Pagename = (string)reader["Pagename"];

            if (Convert.IsDBNull(reader["DispPage"]))
                menuItem.DispPage = null;
            else
                menuItem.DispPage = (string)reader["DispPage"];

            menuItem.Parent = (Int32)reader["Parent"];
            menuItem.sorting = (Int32)reader["sorting"];
            return menuItem;
        }
        internal static lastlogin GetLastLoginItemFactory(SqlDataReader reader)
        {
            lastlogin Items = new lastlogin();
            if (Convert.IsDBNull(reader["username"]))
                Items.username = null;
            else
                Items.username = (string)reader["username"];
            if (Convert.IsDBNull(reader["Designation"]))
                Items.Designation = null;
            else
                Items.Designation = (string)reader["Designation"];

            if (Convert.IsDBNull(reader["Name"]))
                Items.Name = null;
            else
                Items.Name = (string)reader["Name"];
            return Items;
        }

        internal static DropdownIP DropdownItemFactory(SqlDataReader reader)
        {
            DropdownIP dd = new DropdownIP();

            dd.Value = (int)reader["Value"];

            if (Convert.IsDBNull(reader["Text"]))
                dd.Text = null;
            else
                dd.Text = (string)reader["Text"];

            return dd;
        }

        internal static Util.Result resultItemFactory(SqlDataReader reader)
        {
            Util.Result Items = new Util.Result();

            if (Convert.IsDBNull(reader["result"]))
                Items.result = null;
            else
                Items.result = (string)reader["result"];

            return Items;
        }
    }
}