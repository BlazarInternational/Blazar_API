 
function get_browser_info() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'Broser Name: IE ; Version:' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return 'Broser Name: Opera ; Version:' + tem[1] };
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return 'Broser Name:' + M[0] + '; Version:' + M[1];
}
function openssfeedback() {
    var targeturl = "http://www.smartsoft.in/ssfeedback.asp?from=www.mywinway.in"
    newwin = window.open("", "", "scrollbars=no | resizable=no")
    if (document.all) {
        newwin.moveTo((screen.width - 680) / 2, (screen.height - 500) / 2)
        newwin.resizeTo(680, 500)
        //history.back ();
    }
    newwin.location = targeturl
}
function MM_preloadImages() { //v3.0
    var d = document; if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments; for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") != 0) { d.MM_p[j] = new Image; d.MM_p[j++].src = a[i]; }
    }
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 40; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function isUndefinedOrNull(val) {

    if (angular.isUndefined(val) || val === null || val === undefined)
        return '';
    else
        return val;
}
  
var appadminlogin = angular.module('adminloginApp', []);

appadminlogin.factory('$exceptionHandler', function ($injector) {
    return function (exception, cause) {
        var $http = $injector.get("$http");
        var formatted = '';
        var properties = '';
        formatted += 'Broser: "' + get_browser_info() + '" ; \n';
        formatted += 'Location: "' + window.location.href + '" ; \n';
        formatted += 'Exception: "' + exception.toString() + '"\n';
        formatted += 'Caused by: ' + cause + '\n';
        properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
        properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
        properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
        properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''

        if (properties) {
            formatted += properties;
        }
        if (formatted.toLowerCase().indexOf('/api/') == -1) return;
        var reqsenderrormsg = {
            method: 'POST',
            url: "../api/Login/SendErrorMessage",
            params: { subject: 'healthywayz', error: formatted }
        };
        $http(reqsenderrormsg)
           .success(function () {
           });
    }
});
appadminlogin.factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
    return {
        responseError: function responseError(rejection) {
            $exceptionHandler("An HTTP request error has occurred.\nHTTP config: " + JSON.stringify(rejection.config) + ".\nStatus: " + rejection.status);
            return $q.reject(rejection);
        }
    };
});
appadminlogin.controller('AdminLoginCtrl', function ($scope, $http, $filter, $window) {

    $scope.loader = false;
    $scope.Login = function () {
        $scope.loader = true;
        $http({
            method: 'post',
            url: '../api/Login/AdminLogin',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.login)) }
        })
       .then(function (logindata) {
           $scope.AdminLogin = logindata.data[0];
           if (parseInt($scope.AdminLogin.Loginid) > 0) {
               sessionStorage.setItem("Uid", $scope.AdminLogin.Loginid);
               sessionStorage.setItem("Admin", $scope.AdminLogin.Username);
               $scope.SessionsInOut();
           }
           else {
               alertify.alert($scope.AdminLogin.Result);
               $scope.loader = false;
           }
       })
       .catch(function (response) {

           $scope.loader = false;
           alertify.alert(response.Message);
       });
    };
    $scope.SessionsInOut = function () {

        $scope.UserLoginparams = {};
        $scope.UserLoginparams.action = 'In';
        $scope.UserLoginparams.loginid = sessionStorage.getItem("Uid");
        $scope.UserLoginparams.usertype = 'Admin';
        $scope.UserLoginparams.sesid = makeid();

        $http({
            method: 'post',
            url: '../api/Login/SessionsInOut',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginparams)) }
        })
      .then(function (Response) {          
          sessionStorage.setItem("Sesid", Response.data[0].result);
          window.location = "Admin.html";
      })
      .catch(function (response) {
          console.log(response);
          $scope.loader = false;
          alertify.alert(response.Message);
      });

    };
});


var appstoreslogin = angular.module('storesloginApp', []);
appstoreslogin.factory('$exceptionHandler', function ($injector) {
    return function (exception, cause) {
        
        var $http = $injector.get("$http");
        var formatted = '';
        var properties = '';
        formatted += 'Broser: "' + get_browser_info() + '" ; \n';
        formatted += 'Location: "' + window.location.href + '" ; \n';
        formatted += 'Exception: "' + exception.toString() + '"\n';
        formatted += 'Caused by: ' + cause + '\n';
        properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
        properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
        properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
        properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''

        if (properties) {
            formatted += properties;
        }
        if (formatted.toLowerCase().indexOf('/api/') == -1) return;
        var reqsenderrormsg = {
            method: 'POST',
            url: "../api/Login/SendErrorMessage",
            params: { subject: 'healthywayz', error: formatted }
        };
        $http(reqsenderrormsg)
           .success(function () {
           });
    }
});
appstoreslogin.factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
    return {
        responseError: function responseError(rejection) {
            $exceptionHandler("An HTTP request error has occurred.\nHTTP config: " + JSON.stringify(rejection.config) + ".\nStatus: " + rejection.status);
            return $q.reject(rejection);
        }
    };
});
appstoreslogin.controller('StoresLoginCtrl', function ($scope, $http, $filter) {

    $scope.loader = false;
    $scope.StoresLogin = function () {
        
        $scope.loader = true;
        $http({
            method: 'POST',
            url: '../api/Login/StoresLogin',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.login)) }
        })
       .then(function (logindata) {
           $scope.StoresLogin = logindata.data[0];
           if (parseInt($scope.StoresLogin.Loginid) > 0) {
               sessionStorage.setItem("Sid", $scope.StoresLogin.Loginid);
               sessionStorage.setItem("Stores", $scope.StoresLogin.Username);
               $scope.SessionsInOut();
           }
           else {
               alertify.alert($scope.StoresLogin.Result);               
               $scope.loader = false;
           }
       })
       .catch(function (response) {

           $scope.loader = false;
           alertify.alert(response.Message);
       });
    };
    $scope.SessionsInOut = function () {

        $scope.UserLoginparams = {};
        $scope.UserLoginparams.action = 'In';
        $scope.UserLoginparams.loginid = sessionStorage.getItem("Sid");
        $scope.UserLoginparams.usertype = 'Stores';
        $scope.UserLoginparams.sesid = makeid();

        $http({
            method: 'post',
            url: '../api/Login/SessionsInOut',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginparams)) }
        })
      .then(function (Response) {          
          sessionStorage.setItem("Sesid", Response.data[0].result);
          window.location = "Stores.html";
      })
      .catch(function (response) {          
          $scope.loader = false;
          alertify.alert(response.Message);
      });

    };

});


var appmemlogin = angular.module('MemloginApp', []);
appmemlogin.factory('$exceptionHandler', function ($injector) {
    return function (exception, cause) {
        var $http = $injector.get("$http");
        var formatted = '';
        var properties = '';
        formatted += 'Broser: "' + get_browser_info() + '" ; \n';
        formatted += 'Location: "' + window.location.href + '" ; \n';
        formatted += 'Exception: "' + exception.toString() + '"\n';
        formatted += 'Caused by: ' + cause + '\n';
        properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
        properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
        properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
        properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''

        if (properties) {
            formatted += properties;
        }

        if (formatted.toLowerCase().indexOf('/api/') == -1) return;
        var reqsenderrormsg = {
            method: 'POST',
            url: "../api/Login/SendErrorMessage",
            params: { subject: 'healthywayz', error: formatted }
        };
        $http(reqsenderrormsg)
           .success(function () {
           });
    }
});
appmemlogin.factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
    return {
        responseError: function responseError(rejection) {
            $exceptionHandler("An HTTP request error has occurred.\nHTTP config: " + JSON.stringify(rejection.config) + ".\nStatus: " + rejection.status);
            return $q.reject(rejection);
        }
    };
});
appmemlogin.controller('MemberLoginCtrl', function ($scope, $http) {
    
    $scope.loader = false;
    $scope.DistributorLogin = function () {
        $scope.loader = true;
        $http({
            method: 'post',
            url: '../api/Login/DistributorLogin',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.login)) }
        })
       .then(function (logindata) {
           $scope.DBLogin = logindata.data[0];
           if (parseInt($scope.DBLogin.Loginid) > 0) {
               sessionStorage.setItem("Did", $scope.DBLogin.Loginid);
               sessionStorage.setItem("DCode", $scope.DBLogin.Username);
               $scope.SessionsInOut();
           }
           else {
               alertify.alert($scope.DBLogin.Result);
               $scope.loader = false;
           }
       })
       .catch(function (response) {
           $scope.loader = false;
           alertify.alert(response.Message);
       });
    };
    $scope.SessionsInOut = function () {
        $scope.UserLoginparams = {};
        $scope.UserLoginparams.action = 'In';
        $scope.UserLoginparams.loginid = sessionStorage.getItem("Did");
        $scope.UserLoginparams.usertype = 'Member';
        $scope.UserLoginparams.sesid = makeid();
        $http({
            method: 'post',
            url: '../api/Login/SessionsInOut',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginparams)) }
        })
      .then(function (Response) {
          sessionStorage.setItem("Sesid", Response.data[0].result);
          window.location = "Distributor.html";
      })
      .catch(function (response) {
          $scope.loader = false;
          alertify.alert(response.Message);
      });

    };

    $scope.GetForgetPWD = function () {
        $('#ShowProfileModal').modal('show');
    }
    $scope.CheckUserID = function () {
        $scope.forgetloader = true;
        $scope.CheckUserIDParams = {};
        $scope.CheckUserIDParams.action = 'Profile';
        $scope.CheckUserIDParams.idno = $scope.txtIdno;

        var reqCheckUserID = {
            method: 'POST',
            url: "../api/Admin/CheckUserID",
            data: { Info: EncriptInfo(JSON.stringify($scope.CheckUserIDParams)) }
        };
        $http(reqCheckUserID)
           .success(function (Response) {
               $scope.regid = Response[0].regid;
               if ($scope.regid != "0") {
                   $scope.GetValue($scope.regid)
               }
               else {
                   $scope.forgetloader = false;
                   alertify.alert(Response[0].result)
               };
           })
           .error(function (Message) {
               $scope.forgetloader = false;
               alertify.alert(Message.Message);
           });
    };
    $scope.GetValue = function (regid) {
        $scope.getvalparams = {};
        $scope.getvalparams.table = 'MemberProfiles';
        $scope.getvalparams.RequiredColumn = 'LPassword';
        $scope.getvalparams.IdColumn = 'regid';
        $scope.getvalparams.Id = regid.toString();

        var reqMemberProfile = {
            method: 'POST',
            url: "../api/Common/GetValue",
            data: { Info: EncriptInfo(JSON.stringify($scope.getvalparams)) }
        };
        $http(reqMemberProfile)
           .success(function (Response) {
               if (isUndefinedOrNull(Response) != '') {
                   $scope.goegetpwdparams = {};
                   $scope.goegetpwdparams.regid = regid.toString();
                   $scope.goegetpwdparams.pwd = Response;

                   var reqforgetpwd = {
                       method: 'POST',
                       url: "../api/OpenSite/ForGetPassword",
                       data: { Info: EncriptInfo(JSON.stringify($scope.goegetpwdparams)) }
                   };
                   $http(reqforgetpwd)
                      .success(function (Result) {
                          if (isUndefinedOrNull(Result) == '') {
                              alertify.alert('Login Password Send to your Registered Mobile No.');
                              $('#ShowProfileModal').modal('hide');
                              $scope.txtIdno = '';
                              $scope.forgetloader = false;
                          }
                          else {
                              alertify.alert('SMS Send Error');
                              $scope.forgetloader = false;
                          }

                      })
                      .error(function (Message) {
                          alertify.alert(Message.Message);
                          $scope.forgetloader = false;
                      });
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
               $scope.forgetloader = false;
           });
    };
});


var appfranchiselogin = angular.module('franchiseloginApp', []);
appfranchiselogin.factory('$exceptionHandler', function ($injector) {
    return function (exception, cause) {
        var $http = $injector.get("$http");
        var formatted = '';
        var properties = '';
        formatted += 'Broser: "' + get_browser_info() + '" ; \n';
        formatted += 'Location: "' + window.location.href + '" ; \n';
        formatted += 'Exception: "' + exception.toString() + '"\n';
        formatted += 'Caused by: ' + cause + '\n';
        properties += (exception.message) ? 'Message: ' + exception.message + '\n' : ''
        properties += (exception.fileName) ? 'File Name: ' + exception.fileName + '\n' : ''
        properties += (exception.lineNumber) ? 'Line Number: ' + exception.lineNumber + '\n' : ''
        properties += (exception.stack) ? 'Stack Trace: ' + exception.stack + '\n' : ''

        if (properties) {
            formatted += properties;
        }

        if (formatted.toLowerCase().indexOf('/api/') == -1) return;

        var reqsenderrormsg = {
            method: 'POST',
            url: "../api/Login/SendErrorMessage",
            params: { subject: 'MIWellness', error: formatted }
        };
        $http(reqsenderrormsg)
           .success(function () {
           });
    }
});
appfranchiselogin.factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
    return {
        responseError: function responseError(rejection) {
            $exceptionHandler("An HTTP request error has occurred.\nHTTP config: " + JSON.stringify(rejection.config) + ".\nStatus: " + rejection.status);
            return $q.reject(rejection);
        }
    };
});
appfranchiselogin.controller('FranchiseLoginCtrl', function ($scope, $http, $filter) {

    $scope.loader = false;

    $scope.Login = function () {

        $scope.loader = true;
        $http({
            method: 'post',
            url: '../api/Login/FranchiseLogin',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.login)) }
        })
       .then(function (logindata) {

           $scope.FranchiseLogin = logindata.data[0];
           if (parseInt($scope.FranchiseLogin.Loginid) > 0) {
               sessionStorage.setItem("Fid", ($scope.FranchiseLogin.Loginid).toString());
               sessionStorage.setItem("FCode", $scope.FranchiseLogin.Username);
               $scope.SessionsInOut();
           }
           else {
               alertify.alert($scope.FranchiseLogin.Result);
               $scope.loader = false;
           }
       })
       .catch(function (response) {

           $scope.loader = false;
           alertify.alert(response.Message);
       });
    };
    $scope.SessionsInOut = function () {

        $scope.UserLoginparams = {};
        $scope.UserLoginparams.action = 'In';
        $scope.UserLoginparams.loginid = sessionStorage.getItem("Fid");
        $scope.UserLoginparams.usertype = 'Franchise';
        $scope.UserLoginparams.sesid = makeid();
        $http({
            method: 'post',
            url: '../api/Login/SessionsInOut',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginparams)) }
        })
      .then(function (Response) {
          sessionStorage.setItem("Sesid", Response.data[0].result);
          window.location = "Franchise.html";
      })
      .catch(function (response) {
          $scope.loader = false;
          alertify.alert(response.Message);
      });

    };
    $scope.GetForgetPWD = function () {
        $('#ShowProfileModal').modal('show');
    }
    $scope.CheckUserID = function () {
        $scope.forgetpwdloader = true;
        $scope.CheckUserIDParams = {};
        $scope.CheckUserIDParams.action = 'Franchise_FGpwd';
        $scope.CheckUserIDParams.idno = $scope.txtIdno;

        var reqCheckUserID = {
            method: 'POST',
            url: "../api/Admin/CheckUserID",
            data: { Info: EncriptInfo(JSON.stringify($scope.CheckUserIDParams)) }
        };
        $http(reqCheckUserID)
           .success(function (Response) {
               $scope.regid = Response[0].regid;
               if ($scope.regid != "0") {
                   $scope.GetValue($scope.regid)
               }
               else {
                   $scope.forgetpwdloader = false;
                   alertify.alert(Response[0].result)
               };
           })
           .error(function (Message) {
               $scope.forgetpwdloader = false;
               alertify.alert(Message.Message);
           });
    };
    $scope.GetValue = function (regid) {
        $scope.getvalparams = {};

        $scope.getvalparams.table = 'tbl_Franchise';
        $scope.getvalparams.RequiredColumn = 'Password';
        $scope.getvalparams.IdColumn = 'Fid';
        $scope.getvalparams.Id = regid.toString();

        var reqMemberProfile = {
            method: 'POST',
            url: "../api/Common/GetValue",
            data: { Info: EncriptInfo(JSON.stringify($scope.getvalparams)) }
        };
        $http(reqMemberProfile)
           .success(function (Response) {
               if (isUndefinedOrNull(Response) != '') {
                   $scope.forgetpwdparams = {};
                   $scope.forgetpwdparams.action = 'Franchise';
                   $scope.forgetpwdparams.regid = regid.toString();
                   $scope.forgetpwdparams.pwd = Response;
                   var reqforgetpwd = {
                       method: 'POST',
                       url: "../api/OpenSite/ForGetPassword",
                       data: { Info: EncriptInfo(JSON.stringify($scope.forgetpwdparams)) }
                   };
                   $http(reqforgetpwd)
                      .success(function (Result) {
                          if (isUndefinedOrNull(Result) == '') {
                              alertify.alert('Login Password Send to your Registered Mobile No.');
                              $('#ShowProfileModal').modal('hide');
                              $scope.txtIdno = '';
                              $scope.forgetpwdloader = false;
                          }
                          else {
                              alertify.alert('SMS Send Error');
                              $scope.forgetpwdloader = false;
                          }

                      })
                      .error(function (Message) {
                          alertify.alert(Message.Message);
                          $scope.forgetpwdloader = false;
                      });
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
               $scope.forgetpwdloader = false;
           });
    };
});