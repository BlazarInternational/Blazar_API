using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API
{
    public class SSDAL : ISSDAL
    {
        private static SSDAL _dl;

        private static readonly Object Dllock = new Object();

        private static IConnService _connservice;

        private SSDAL()
        {
            _connservice = new ConnService();

        }
        public static ISSDAL Instance
        {
            get
            {
                if (_dl == null)
                {
                    lock (Dllock)
                    {
                        if (_dl == null)
                        {
                            _dl = new SSDAL();
                        }
                    }
                }
                return _dl;
            }
        }
        public IConnService ConnService
        {
            get
            {
                return _connservice;
            }
        }
    }
}