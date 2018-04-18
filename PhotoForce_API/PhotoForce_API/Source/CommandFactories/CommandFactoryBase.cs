using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public abstract class CommandFactoryBase
    {
        #region CreateCommand
        /// <summary>
        /// <c>Create a SqlCommand</c>
        /// </summary>
        /// <param name="commandName">The commandName is Stored Procedure Name</param>
        /// <param name="commandType"><c>The commandType is type of the Sql Command</c></param>
        /// <param name="parameters">The parameters is list of parameters to bind Stored Procedure</param>
        /// <returns><c>returns the SqlCommand</c></returns>
        protected static SqlCommand CreateCommand(string commandName, CommandType commandType, SqlParameter[] parameters)
        {
            var command = new SqlCommand(commandName) { CommandType = commandType };
            if (parameters != null)
            {
                foreach (SqlParameter parameter in parameters)
                {
                    command.Parameters.Add(parameter);
                }
            }

            return command;
        }

        /// <summary>
        /// <c>Create a SqlCommand</c>
        /// </summary>
        /// <param name="commandName">The commandName is Stored Procedure Name</param>
        /// <param name="parameters">The parameters is list of parameters to bind Stored Procedure</param>
        /// <returns><c>returns the SqlCommand</c></returns>
        protected static SqlCommand CreateCommand(string commandName, SqlParameter[] parameters)
        {
            return CreateCommand(commandName, CommandType.StoredProcedure, parameters);
        }

        /// <summary>
        /// <c>Create a SqlCommand</c>
        /// </summary>
        /// <param name="commandName">The commandName is Stored Procedure Name</param>
        /// <param name="parameters">The parameters is list of parameters to bind Stored Procedure</param>
        /// <param name="commandType"><c>The commandType is type of the Sql Command</c></param>
        /// <returns><c>returns the SqlCommand</c></returns>
        protected static SqlCommand CreateCommand(string commandName, SqlParameter[] parameters, string commandType)
        {
            return CreateCommand(commandName, CommandType.Text, null);
        }

        /// <summary>
        /// <c>Create a SqlCommand</c>
        /// </summary>
        /// <param name="commandName">The commandName is Stored Procedure Name</param>
        /// <returns><c>returns the SqlCommand</c></returns>
        protected static SqlCommand CreateCommand(string commandName)
        {
            return CreateCommand(commandName, null);
        }
        #endregion CreateCommand

        #region CreateParameter
        /// <summary>
        /// Create and assign the parameter to Stored Procedures
        /// </summary>
        /// <param name="parameterName">The parameterName is name of the parameter</param>
        /// <param name="parameterType">The parameterType is type of the parameter</param>
        /// <param name="size">The size is size of the parameter</param>
        /// <param name="direction">The direction is Input/Output</param>
        /// <param name="value">The value is actual parameter value</param>
        /// <returns><c>returns sqlParameter</c></returns>
        protected static SqlParameter CreateParameter(string parameterName, SqlDbType parameterType, int size, ParameterDirection direction, object value)
        {
            var parameter = new SqlParameter(parameterName, parameterType, size)
            {
                Direction = direction,
                Value = value
            };
            return parameter;
        }

        /// <summary>
        /// Create and assign the parameter to Stored Procedures
        /// </summary>
        /// <param name="parameterName">The parameterName is name of the parameter</param>
        /// <param name="parameterType">The parameterType is type of the parameter</param>
        /// <param name="size">The size is size of the parameter</param>
        /// <param name="value">The value is actual parameter value</param>
        /// <returns><c>returns sqlParameter</c></returns>
        protected static SqlParameter CreateParameter(string parameterName, SqlDbType parameterType, int size, object value)
        {
            return CreateParameter(parameterName, parameterType, size, ParameterDirection.Input, value);
        }

        /// <summary>
        /// Create and assign the parameter to Stored Procedures
        /// </summary>
        /// <param name="parameterName">The parameterName is name of the parameter</param>
        /// <param name="parameterType">The parameterType is type of the parameter</param>
        /// <param name="value">The value is actual parameter value</param>
        /// <returns><c>returns sqlParameter</c></returns>
        protected static SqlParameter CreateParameter(string parameterName, SqlDbType parameterType, object value)
        {
            return CreateParameter(parameterName, parameterType, 0, value);
        }

        protected static SqlParameter CreateParameter(string parameterName, SqlDbType parameterType, object value, string typeName)
        {
            var parameter = new SqlParameter(parameterName, parameterType)
            {
                Value = value,
                TypeName = typeName
            };
            return parameter;
        }
        #endregion CreateParameter


    }
}