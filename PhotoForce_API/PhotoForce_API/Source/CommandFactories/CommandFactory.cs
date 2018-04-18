using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public partial class CommandFactory : CommandFactoryBase
    {
        /// <summary>
        /// <c>Get the SqlCommand for the requested Query</c>
        /// </summary>
        /// <param name="strSql"><c>The strSql is SQLquery</c></param>
        /// <returns><c>The SqlCommand returns</c></returns>
        internal static SqlCommand GetCommand(string strSql)
        {
            return CreateCommand(strSql, null, "Text");
        }

        /// <summary>
        /// <c>Get the SqlCommand for the requested Stored Procedures</c>
        /// </summary>
        /// <param name="commandName">The commandName is Stored Procedure name</param>
        /// <param name="parameters">The parameters is array of parameters to Stored Procedure</param>
        /// <returns><c>The SqlCommand returns</c></returns>
        internal static SqlCommand GetCommand(string commandName, SqlParameter[] parameters)
        {
            return CreateCommand(commandName, parameters);
        }
    }
}