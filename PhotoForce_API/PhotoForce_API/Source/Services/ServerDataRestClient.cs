using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using PhotoForce_API.Models;
using RestSharp;
using Newtonsoft.Json;

namespace PhotoForce_API.Services
{
    public class ServerDataRestClient : IServerDataRestClient
    {
        private readonly RestClient _client;
        // private readonly string _url = ConfigurationManager.AppSettings["webapibaseurl"];

        public ServerDataRestClient()
        {
            // _client = new RestClient(_url);
        }



        public TokenDetails GetAuthorizationToken()
        {

            var client = new RestClient("https://auth.getphoto.io/oauth/access_token");
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/x-www-form-urlencoded");
            request.AddParameter("application/x-www-form-urlencoded",
            "grant_type=password&password=Scanjet$22&username=phaneesh811@gmail.com&client_id=freed_photography&client_secret=4gqiVrPiN5JRDbC5sg6s56LL1wKxqaHK&scope=core.jobs.read,core.orders.read", ParameterType.RequestBody);
            IRestResponse Token = client.Execute(request);
            TokenDetails TokenDetails = new TokenDetails();
            TokenDetails = JsonConvert.DeserializeObject<TokenDetails>(Token.Content);
            return TokenDetails;

        }

        public List<OrderDetails> GetPhotos()
        {
            TokenDetails TokenDetails = new TokenDetails();
            TokenDetails = GetAuthorizationToken();
            var client = new
            RestClient("https://api.getphoto.io/v4/orders?page=1&limit=100&payment_status=paid&fields=");
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", TokenDetails.token_type + " " + TokenDetails.access_token);
            IRestResponse Token = client.Execute(request);
            List<OrderDetails> OrderDetails = new List<OrderDetails>();
            OrderDetails = JsonConvert.DeserializeObject<List<OrderDetails>>(Token.Content);
            return OrderDetails;

        }

        public sampleorders GetSimplePhotos(string fromdate, string todate)
        {
            var client = new RestClient("https://cp.simplephoto.com/freed_products?start_date=20170401&end_date=20170430");
            var request = new RestRequest(Method.GET) { RequestFormat = DataFormat.Json };
            request.AddHeader("Authorization", "Token Mv7qQgDtK4PhtxbRUCiJMUzUQpMGGBEX");
            var response = client.Execute(request);
            sampleorders OrderDetails = new sampleorders();
            OrderDetails = JsonConvert.DeserializeObject<sampleorders>(response.Content);
            return OrderDetails;
        }
    }
}