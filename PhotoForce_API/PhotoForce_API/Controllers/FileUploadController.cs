using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace PhotoForce_API.Controllers
{
    public class FileUploadController : ApiController
    {


        [System.Web.Mvc.HttpPost]
        public string UploadDailyExpenses()
        {
            int iUploadedCnt = 0;

            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/DailyExpenses/");

            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            string FileNa = "";
            var renamedFile = RandomString(10);
            renamedFile = "Expenses_" + renamedFile + "_" + System.DateTime.Now.ToString("dd-MM-yyyy");
            // CHECK THE FILE COUNT.
            for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
            {
                System.Web.HttpPostedFile hpf = hfc[iCnt];

                if (hpf.ContentLength > 0)
                {
                    var filename = Path.GetExtension(hpf.FileName);
                    // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)
                    if (!File.Exists(sPath + Path.GetFileName(renamedFile + filename)))
                    {
                        // SAVE THE FILES IN THE FOLDER.
                        hpf.SaveAs(sPath + Path.GetFileName(renamedFile + filename));
                        FileNa = renamedFile + filename;
                        iUploadedCnt = iUploadedCnt + 1;

                    }
                }
            }
            return FileNa;
        }

        [System.Web.Mvc.HttpPost]
        public string UploadDailyPurchase()
        {
            int iUploadedCnt = 0;

            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/DailyPurchase/");

            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            string FileNa = "";
            var renamedFile = RandomString(10);
            renamedFile = "Purchase_" + renamedFile + "_" + System.DateTime.Now.ToString("dd-MM-yyyy");
            // CHECK THE FILE COUNT.
            for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
            {
                System.Web.HttpPostedFile hpf = hfc[iCnt];

                if (hpf.ContentLength > 0)
                {
                    var filename = Path.GetExtension(hpf.FileName);
                    // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)
                    if (!File.Exists(sPath + Path.GetFileName(renamedFile + filename)))
                    {
                        // SAVE THE FILES IN THE FOLDER.
                        hpf.SaveAs(sPath + Path.GetFileName(renamedFile + filename));
                        FileNa = renamedFile + filename;
                        iUploadedCnt = iUploadedCnt + 1;

                    }
                }
            }
            return FileNa;
        }

        [System.Web.Mvc.HttpPost]
        public string UploadSiteProgress()
        {
            int iUploadedCnt = 0;

            // DEFINE THE PATH WHERE WE WANT TO SAVE THE FILES.
            string sPath = "";
            sPath = System.Web.Hosting.HostingEnvironment.MapPath("~/SiteProgress/");

            System.Web.HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;

            string FileNa = "";
            var renamedFile = RandomString(10);
            renamedFile = "SiteProgress_" + renamedFile + "_" + System.DateTime.Now.ToString("dd-MM-yyyy");
            // CHECK THE FILE COUNT.
            for (int iCnt = 0; iCnt <= hfc.Count - 1; iCnt++)
            {
                System.Web.HttpPostedFile hpf = hfc[iCnt];

                if (hpf.ContentLength > 0)
                {
                    var filename = Path.GetExtension(hpf.FileName);
                    // CHECK IF THE SELECTED FILE(S) ALREADY EXISTS IN FOLDER. (AVOID DUPLICATE)
                    if (!File.Exists(sPath + Path.GetFileName(renamedFile + filename)))
                    {
                        // SAVE THE FILES IN THE FOLDER.
                        hpf.SaveAs(sPath + Path.GetFileName(renamedFile + filename));
                        FileNa = renamedFile + filename;
                        iUploadedCnt = iUploadedCnt + 1;

                    }
                }
            }
            return FileNa;
        }

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }      
    }
}
