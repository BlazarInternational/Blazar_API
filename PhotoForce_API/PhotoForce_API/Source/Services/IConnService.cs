using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public interface IConnService
    {
        SsConnection GetClientConnection(string environment);
    }
}