using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PhotoForce_API.Models
{
    public class ordered_products
    {
        public int order_id { get; set; }
        public string image_id { get; set; }
        public int quantity { get; set; }
        public string billing_code { get; set; }
        public Int32 price { get; set; }

    }

    public class sampleorders 
    {
        public List<ordered_products> ordered_products { get; set; }
    }

    public class OrderDetails
    {
        public string id { get; set; }
        public string number { get; set; }
        public string key { get; set; }
        public string job_id { get; set; }
        public string payment_method { get; set; }
        public string payment_status { get; set; }
        public string created { get; set; }

        public OrderAmount amount { get; set; }
        public OrderInvoice_Address invoice_address { get; set; }
        public Ordershipping_address shipping_address { get; set; }

    }

    public class TokenDetails
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public Int32 expires_in { get; set; }
        public string refresh_token { get; set; }
    }

    public class OrderAmount
    {
        public string id { get; set; }
        public string amount { get; set; }
        public string currency { get; set; }
    }

    public class OrderInvoice_Address
    {
        public string id { get; set; }
        public string title { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string company { get; set; }
        public string street1 { get; set; }
        public string street2 { get; set; }
        public string zip { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country_code { get; set; }
        public string created { get; set; }

    }

    public class Ordershipping_address
    {
        public string id { get; set; }
        public string title { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string company { get; set; }
        public string street1 { get; set; }
        public string street2 { get; set; }
        public string zip { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country_code { get; set; }
        public string created { get; set; }

    }
}