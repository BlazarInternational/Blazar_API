using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
    using System.Xml;

    /// <summary>
    /// This class helps all CRUD operations
    /// </summary>
    internal class SqlHelpers
    {
        #region Private members
        /// <summary>
        /// command timeout
        /// </summary>
        private static int commandTimeout = 0;

        /// <summary>
        /// Gets CommandTimeout value
        /// </summary>
        private static int CommandTimeout
        {
            get
            {
                if (commandTimeout == 0)
                {
                    ////get it from config file
                }

                return 30;
            }
        }
        #endregion private Members

        /// <summary>
        /// <c>Delegator for datareader object</c>
        /// </summary>
        /// <param name="reader"><c>The reader is SqlDataReader object</c></param>
        /// <returns>returns object</returns>
        internal delegate object ItemFactoryDelegate(SqlDataReader reader);

        /// <summary>
        /// <c>The GetObject method data from the database based on SqlCommand</c>
        /// </summary>
        /// <typeparam name="T"><c>T isGeneric datatype</c></typeparam>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="itemFactory">itemFactory is Delegate object</param>
        /// <returns>returns the IList generic object</returns>
        internal static List<T> GetObjects<T>(string environment, SqlCommand cmd, ItemFactoryDelegate itemFactory)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            SqlDataReader reader = null;
            var result = new List<T>();

            try
            {
                connection.Open();
                cmd.Connection = connection;

                    reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add((T)itemFactory(reader));
                }
            }
            catch (Exception e)
            {
                Util.SendErrorMail("PhotoForce_API", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }

                connection.Close();
            }

            return result;
        }

        /// <summary>
        /// <c>The GetObject method data from the database based on SqlCommand</c>
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <returns>returns the IList generic object</returns>
        internal static string GetObjects(string environment, SqlCommand cmd)
        {
            string result;

            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            SqlDataReader reader = null;

            try
            {
                connection.Open();
                cmd.Connection = connection;

                reader = cmd.ExecuteReader();
                reader.Read();
                result =Convert.ToString(reader[0]);
            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }

                connection.Close();
            }

            return result;
        }
        /// <summary>
        /// <c>The GetObject method data from the database based on SqlCommand</c>
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <returns>returns the IList generic object</returns>
        internal static string GetXMLObjects(string environment, SqlCommand cmd)
        {
            string result = string.Empty;

            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            XmlReader reader = null;

            try
            {
                connection.Open();
                cmd.Connection = connection;

                reader = cmd.ExecuteXmlReader();
                reader.Read();
                //result = reader[0].ToString();

                while (reader.ReadState != System.Xml.ReadState.EndOfFile)
                {
                    result = reader.ReadOuterXml();
                }

            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }

                connection.Close();
            }

            return result;
        }

        /// <summary>
        /// <c>The GetObject method getting data from the database based on SqlCommand</c>
        /// </summary>
        /// <typeparam name="T"><c>T isGeneric datatype</c></typeparam>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="itemFactory">itemFactory is Delegate object</param>
        /// <param name="connString">connString is client connection string</param>
        /// <returns>returns the IList generic object</returns>
        internal static IList<T> GetObjects<T>(string environment, SqlCommand cmd, ItemFactoryDelegate itemFactory, string connString)
        {
            SqlConnection connection = cmd.Connection ?? new SqlConnection(connString);
            SqlDataReader reader = null;
            IList<T> result = new List<T>();

            try
            {
                connection.Open();
                cmd.Connection = connection;

                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add((T)itemFactory(reader));
                }
            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }

                connection.Close();
            }

            return result;
        }

        /// <summary>
        /// <c>The GetSortedObjects method getting sorted data from the database based on SqlCommand</c>
        /// </summary>
        /// <typeparam name="TKey">TKey is sorted key value</typeparam>
        /// <typeparam name="TValue">TValue is sorted values</typeparam>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="itemFactory">itemFactory is Delegate object</param>
        /// <returns>returns the IDictionary generic object</returns>
        internal static IDictionary<TKey, TValue> GetSortedObjects<TKey, TValue>(string environment, SqlCommand cmd, ItemFactoryDelegate itemFactory)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            SqlDataReader reader = null;
            IDictionary<TKey, TValue> result = new Dictionary<TKey, TValue>();

            try
            {
                connection.Open();
                cmd.Connection = connection;

                reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add((TKey)reader[0], (TValue)itemFactory(reader));
                }
            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                if (reader != null)
                {
                    reader.Close();
                }

                connection.Close();
            }

            return result;
        }

        /// <summary>
        /// <c>The GetObject method getting data from the database based on SqlCommand</c>
        /// </summary>
        /// <typeparam name="T"><c>T isGeneric datatype</c></typeparam>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="itemFactory">itemFactory is Delegate object</param>
        /// <returns>returns the IList generic object</returns>
        internal static T GetObject<T>(string environment, SqlCommand cmd, ItemFactoryDelegate itemFactory)
        {
            IList<T> obj = GetObjects<T>(environment, cmd, itemFactory);
            if (obj.Count > 0)
            {
                return obj[0];
            }

            return default(T);
        }

        /// <summary>
        /// <c>The GetObject method getting data from the database based on SqlCommand</c>
        /// </summary>
        /// <typeparam name="T"><c>T isGeneric datatype</c></typeparam>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <returns>returns the IList generic object</returns>
        internal static T GetValue<T>(string environment, SqlCommand cmd)
        {
            T returnValue = default(T);
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            try
            {
                connection.Open();
                cmd.Connection = connection;

                object value = cmd.ExecuteScalar();

                if (value != null && value != DBNull.Value)
                {
                    returnValue = (T)value;
                }
            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                connection.Close();
            }

            return returnValue;
        }

        internal static DataTable GetTable(string environment, SqlCommand cmd)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            var dataTable = new DataTable("NewTable");

            try
            {
                connection.Open();
                cmd.Connection = connection;
                var adapter = new SqlDataAdapter(cmd);
                adapter.Fill(dataTable);
            }
            catch (Exception e)
            {
                Util.SendErrorMail("healthywayz", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                connection.Close();
            }

            return dataTable;
        }

        internal static DataSet GetDataSet(string environment, SqlCommand cmd)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            var dataSet = new DataSet("NewDataSet");

            try
            {
                connection.Open();
                cmd.Connection = connection;
                var adapter = new SqlDataAdapter(cmd);
                adapter.Fill(dataSet);
            }
            catch (Exception e)
            {
                Util.SendErrorMail("PhotoForce_API", e.Message + ';' + e.StackTrace);
                throw e;
            }
            finally
            {
                connection.Close();
            }

            return dataSet;
        }

        /// <summary>
        /// Delete the records from the database based on Query
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        internal static void DeleteObject(string environment, SqlCommand cmd)
        {
            ExecuteSql(environment, cmd);
        }

        /// <summary>
        /// Delete the records from the database based on Delete Query
        /// and returns the status value
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="outParameters">outParameters is returns value from the database</param>
        internal static void DeleteObject(string environment, SqlCommand cmd, out IDictionary<String, Object> outParameters)
        {
            ExecuteSql(environment, cmd);
            outParameters = new Dictionary<String, Object>();
            foreach (SqlParameter param in cmd.Parameters)
            {
                if (param.Direction == ParameterDirection.InputOutput || param.Direction == ParameterDirection.Output)
                {
                    outParameters.Add(param.ParameterName, param.Value);
                }
            }
        }

        /// <summary>
        /// <c>Save the recrods into database based on Insert Query</c>
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        internal static void SaveObject(string environment, SqlCommand cmd)
        {
            IDictionary<String, Object> outparameters;
            SaveObject(environment, cmd, out outparameters);
        }

        /// <summary>
        /// <c>Save the recrods into database based on Insert Query</c>
        /// and returns the status value
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="outParameters">outParameters is returns value from the database</param>
        internal static void SaveObject(string environment, SqlCommand cmd, out IDictionary<String, Object> outParameters)
        {
            ExecuteSql(environment, cmd);
            outParameters = new Dictionary<String, Object>();
            foreach (SqlParameter param in cmd.Parameters)
            {
                if (param.Direction == ParameterDirection.InputOutput || param.Direction == ParameterDirection.Output)
                {
                    outParameters.Add(param.ParameterName, param.Value);
                }
            }
        }

        /// <summary>
        /// <c>Save the recrods into database based on Insert Query</c>
        /// and returns the status value
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="strStatus"><c>strStatus is returns value from the database</c></param>
        /// <returns>returns data is effect or not</returns>
        internal static int SaveObject(string environment, SqlCommand cmd, string strStatus)
        {
            IDictionary<String, Object> outparameters;
            return SaveObject(environment, cmd, out outparameters, strStatus);
        }

        /// <summary>
        /// <c>Save the recrods into database based on Insert Query</c>
        /// and returns the status value
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="outParameters">outParameters is returns value from the database</param>
        /// <param name="strStatus"><c>strStatus is returns value from the database</c></param>
        /// <returns>returns data is effect or not</returns>
        internal static int SaveObject(string environment, SqlCommand cmd, out IDictionary<String, Object> outParameters, string strStatus)
        {
            int rowsAff = ExecuteSql(environment, cmd, strStatus);
            outParameters = new Dictionary<String, Object>();
            foreach (SqlParameter param in cmd.Parameters)
            {
                if (param.Direction == ParameterDirection.InputOutput || param.Direction == ParameterDirection.Output)
                {
                    outParameters.Add(param.ParameterName, param.Value);
                }
            }

            return rowsAff;
        }

        /// <summary>
        /// <c>Get the Guid</c>
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <returns><c>returns the guid</c></returns>
        internal static Guid ExecuteSyncStart(string environment, SqlCommand cmd)
        {
            ExecuteSql(environment, cmd);
            return (Guid)cmd.Parameters["@InstanceId"].Value;
        }

        /// <summary>
        /// <c>Exectue the SQL Statements</c>
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        internal static void ExecuteSyncEnd(string environment, SqlCommand cmd)
        {
            ExecuteSql(environment, cmd);
        }

        /// <summary>
        /// Copy the huge data using this method
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="sourceCmd"><c>sourceCmd is source database SqlCommand</c></param>
        /// <param name="destConnStr"><c>destConnStr is dest Sql connection string</c></param>
        /// <param name="destTable"><c>destTable is dest Sql table name</c></param>
        internal static void BulkCopy(string environment, SqlCommand sourceCmd, String destConnStr, String destTable)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection sourceConnection = sourceCmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            using (sourceConnection)
            {
                sourceConnection.Open();

                SqlDataReader reader = sourceCmd.ExecuteReader();

                using (var destinationConnection = new SqlConnection(destConnStr))
                {
                    destinationConnection.Open();

                    using (var bulkCopy = new SqlBulkCopy(destinationConnection))
                    {
                        bulkCopy.DestinationTableName = destTable;
                        try
                        {
                            bulkCopy.WriteToServer(reader);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        finally
                        {
                            reader.Close();
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Get the Client Connection String
        /// </summary>
        /// <returns>returns the connection string</returns>
        //internal static string GetConString()
        //{
        //    string strConfigConnection = ConfigurationManager.AppSettings["ConnectionString"];
        //    return strConfigConnection;
        //}

        /// <summary>
        /// Execute any DML command thru this method
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        private static void ExecuteSql(string environment, SqlCommand cmd)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);
            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            try
            {
                connection.Open();
                cmd.Connection = connection;
                cmd.ExecuteNonQuery();
            }
            finally
            {
                connection.Close();
            }
        }

        /// <summary>
        /// Execute any DML command thru this method
        /// </summary>
        /// <param name="environment"><c>environment is either dev, stag or prod</c></param>
        /// <param name="cmd"><c>cmd is SqlCommand</c></param>
        /// <param name="strStatus"><c>strStatus is returns value from the database</c></param>
        /// <returns>returns effect rows number</returns>
        private static int ExecuteSql(string environment, SqlCommand cmd, string strStatus)
        {
            SsConnection ssconn = SSDAL.Instance.ConnService.GetClientConnection(environment);

            SqlConnection connection = cmd.Connection ?? new SqlConnection(ssconn.EnterpriseConnectionString);

            try
            {
                connection.Open();
                cmd.Connection = connection;
                int rowsAffetected = cmd.ExecuteNonQuery();
                return rowsAffetected;
            }
            catch (Exception)
            {
                return 0;
            }
            finally
            {
                connection.Close();
            }
        }

    }
}