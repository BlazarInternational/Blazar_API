using System.Collections.Generic;
using PhotoForce_API.Models;

namespace PhotoForce_API.Services
{
    public interface IServerDataRestClient
    {
        List<OrderDetails> GetPhotos();
        sampleorders GetSimplePhotos(string fromdate, string todate);
    }
}
