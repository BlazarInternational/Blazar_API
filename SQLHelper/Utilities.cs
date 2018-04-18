using System;
using System.Data;
using System.Xml;
using System.Data.SqlClient;
using System.Collections;

namespace SQLHelper
{
    public static class Utilities
    {
        #region CopyData
        public static void CopyBulkData(DataTable dtweek, string conString, string tableName)
        {
            // new method: SQLBulkCopy:
            SqlConnection destConnection = new SqlConnection(conString);
            using (SqlBulkCopy s = new SqlBulkCopy(destConnection))
            {
                s.DestinationTableName = tableName;
                //s.NotifyAfter = 10000;
                s.SqlRowsCopied += new SqlRowsCopiedEventHandler(s_SqlRowsCopied);
                destConnection.Open();
                s.WriteToServer(dtweek);
                s.Close();
                destConnection.Close();
            }
        }
        static void s_SqlRowsCopied(object sender, SqlRowsCopiedEventArgs e)
        {
            //Console.WriteLine("-- Copied {0} rows.", e.RowsCopied);
        }

        #endregion

    }
}
