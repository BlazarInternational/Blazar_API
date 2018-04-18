using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    using System;

    /// <summary>
    /// <c>SsConnection for getting the connection string</c>
    /// </summary>
    public class SsConnection
    {
        /// <summary>
        /// Store the Server
        /// </summary>
        private readonly String _server = string.Empty;

        /// <summary>
        /// Store the database
        /// </summary>
        private readonly String _database = string.Empty;

        /// <summary>
        /// Store the ConnectionString
        /// </summary>
        private readonly String _enterpriseConnectionString;

        /// <summary>
        /// <c>Initializes a new instance of the SsConnection class.</c>
        /// </summary>
        /// <param name="enterpriseConnectionString">enterpriseConnectionString is a connection string</param>
        public SsConnection(String enterpriseConnectionString)
        {
            _enterpriseConnectionString = enterpriseConnectionString;
        }

        /// <summary>
        /// Gets the enterprise connection string
        /// </summary>
        public String EnterpriseConnectionString
        {
            get
            {
                return _enterpriseConnectionString;
            }
        }

        /// <summary>
        /// Gets the Server value 
        /// </summary>
        public String Server
        {
            get
            {
                return _server;
            }
        }

        /// <summary>
        /// Gets the database Value
        /// </summary>
        public String Database
        {
            get
            {
                return _database;
            }
        }

        /// <summary>
        /// Gets the Linked Database Connection
        /// </summary>
        public String LinkedDbConnection
        {
            get
            {
                return String.Format("[{0}].[{1}].dbo", _server, _database);
            }
        }
    }
}