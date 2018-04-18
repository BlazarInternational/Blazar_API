 
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
            url: '../api/AdminLogin/AdminLogin',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.login)) }
        })
       .then(function (logindata) {
           $scope.AdminLogin = logindata.data[0];
           if (parseInt($scope.AdminLogin.Loginid) > 0) {
               sessionStorage.setItem("Uid", $scope.AdminLogin.Loginid);
               sessionStorage.setItem("Admin", $scope.AdminLogin.Username);
               sessionStorage.setItem("IsAdmin", $scope.AdminLogin.IsAdmin);
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
       })
        .error(function (e) { alert(e);});
        };
    $scope.SessionsInOut = function () {

        $scope.UserLoginparams = {};
        $scope.UserLoginparams.action = 'In';
        $scope.UserLoginparams.loginid = sessionStorage.getItem("Uid");
        $scope.UserLoginparams.usertype = 'Admin';
        $scope.UserLoginparams.sesid = makeid();

        $http({
            method: 'post',
            url: '../api/AdminLogin/SessionsInOut',
            headers: { 'Content-Type': 'application/json' },
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginparams)) }
        })
      .then(function (Response) {          
          sessionStorage.setItem("Sesid", Response.data[0].result);
          
          window.location = "Admin/Admin.html";
      })
      .catch(function (response) {
          console.log(response);
          $scope.loader = false;
          alertify.alert(response.Message);
      });

    };
});
