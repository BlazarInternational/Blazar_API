
var app = angular.module('AdminApp', ['ngRoute', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'ngSanitize', 'Alertify', 'infinite-scroll']);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', { templateUrl: 'Index.html' })
        .when('/Index', { templateUrl: 'Index.html' })
         // User Manager
        .when('/Create-Employee', { templateUrl: 'Employee.html' })
        .when('/View-Employee', { templateUrl: 'EmployeeRpt.html' })
        .when('/Change-Password', { templateUrl: 'ChangePassword.html' })
        .when('/Reset-Password', { templateUrl: 'ResetPassword.html' })

        .when('/SimplePhoto', { templateUrl: 'GetSimplePhotos.html' })
        .when('/GetPhoto', { templateUrl: 'GetPhotosOrders.html' })


        .when('/0', { templateUrl: 'LogOut.html' })
         .otherwise({
             redirectTo: function () {
                 window.location = "../Login.html";
             }
         });
    $httpProvider.interceptors.push('errorHttpInterceptor');
});

app.directive('checkProductImage', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('ngSrc', function (ngSrc) {
                $http.get(ngSrc).success(function () {
                }).error(function () {
                    element.attr('src', '../fileupload/ProductImages/noimage.jpg'); // set default image
                });
            });
        }
    };
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {


        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(function (d) {
            $scope.FileName = d;
        })
        .error(function () {
            alert('Error')
        });
    }
}]);
app.directive('percentageFormat', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var value;
                var clean = val.replace(/[^0-9\.]/g, '');
                if (parseFloat(clean) > 100) {
                    clean = clean.slice(0, clean.length - 1);
                }
                else {
                    var decimalCheck = clean.split('.');
                    if (!angular.isUndefined(decimalCheck[1])) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }
                }
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });
            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});
app.directive("disableRightClick", function () {
    return {
        restict: 'A',
        link: function (scope, el) {
            el.bind("contextmenu", function (e) {
                e.preventDefault();
                //alertify.alert("Right Click Not Allowed.");
            });
        }
    };
});
app.service('dataService', function () {
    var property = 0;
    StateId = property;
});
app.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });
            });
        }
    }
});
app.directive('starRatingView', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">'
                 + '	<li ng-repeat="star in stars" ng-class="star">'
                 + '\u2605'
                 + '</li>'
                 + '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.$watch('ratingValue',
                function (oldVal, newVal) {
                    if (newVal) {
                        updateStars();
                    }
                }
            );
        }
    };
});
app.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    }
    return {
        link: fn_link
    };
}]);

app.run(function ($rootScope, $timeout, $document, $http, $templateCache) {

    // Timeout timer value 1 sec = 1000
    //var TimeOutTimerValue = 4000; // 4 sec
    var TimeOutTimerValue = 1000 * 60 * 15; // 15 min

    // Start a timeout
    var TimeOut_Thread = $timeout(function () { LogoutByTimer(); }, TimeOutTimerValue);
    var bodyElement = angular.element($document);

    /// Keyboard Events
    bodyElement.bind('keydown', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('keyup', function (e) { TimeOut_Resetter(e); });

    /// Mouse Events    
    bodyElement.bind('click', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('mousemove', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('DOMMouseScroll', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('mousewheel', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('mousedown', function (e) { TimeOut_Resetter(e); });

    /// Touch Events
    bodyElement.bind('touchstart', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('touchmove', function (e) { TimeOut_Resetter(e); });

    /// Common Events
    bodyElement.bind('scroll', function (e) { TimeOut_Resetter(e); });
    bodyElement.bind('focus', function (e) { TimeOut_Resetter(e); });

    function LogoutByTimer() {
        if (isUndefinedOrNull(sessionStorage.getItem("Uid")) !== '') {

            $rootScope.logoutparams = {};
            $rootScope.logoutparams.action = 'Up';
            $rootScope.logoutparams.loginid = sessionStorage.getItem("Uid");
            $rootScope.logoutparams.usertype = 'Admin';
            $rootScope.logoutparams.sesid = sessionStorage.getItem("Sesid");

            var req = {
                method: 'POST',
                url: "../api/Login/SessionsInOut",
                data: { Info: EncriptInfo(JSON.stringify($rootScope.logoutparams)) }
            };
            $http(req)
               .success(function (Response) {
                   sessionStorage.removeItem("Uid");
                   sessionStorage.setItem("Admin", null);
                   sessionStorage.setItem("Sesid", null);

                   window.location = "../Login.html";
               });
        }
        else {
            sessionStorage.removeItem("Uid");
            sessionStorage.setItem("Admin", null);
            sessionStorage.setItem("Sesid", null);

            window.location = "../Login.html";
        }
    }

    function TimeOut_Resetter(e) {
        /// Stop the pending timeout
        $timeout.cancel(TimeOut_Thread);

        /// Reset the timeout
        //TimeOut_Thread = $timeout(function () { LogoutByTimer(); }, TimeOutTimerValue);
    }


    // Login ID Checking Start  

    var bodyElement1 = angular.element($document);
    /// Keyboard Events
    bodyElement1.bind('keydown', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('keyup', function (e) { TimeOut_Resetter1(e) });

    /// Mouse Events    
    bodyElement1.bind('click', function (e) { TimeOut_Resetter1(e) });
    //bodyElement1.bind('mousemove', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('DOMMouseScroll', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('mousewheel', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('mousedown', function (e) { TimeOut_Resetter1(e) });

    /// Touch Events
    bodyElement1.bind('touchstart', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('touchmove', function (e) { TimeOut_Resetter1(e) });

    /// Common Events
    bodyElement1.bind('scroll', function (e) { TimeOut_Resetter1(e) });
    bodyElement1.bind('focus', function (e) { TimeOut_Resetter1(e) });

    function LogoutByTimer1() {
        //if (isUndefinedOrNull(sessionStorage.getItem("Uid")) == '') {
        //    window.location = "../Login.html";
        //}
    }
    function TimeOut_Resetter1(e) {
       // TimeOut_Thread1 = $timeout(function () { LogoutByTimer1() }, 0);
    }

    // Login ID Checking End    
});
app.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});
app.factory('$exceptionHandler', function ($injector) {
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
        // alert(exception.message);
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
app.factory('errorHttpInterceptor', function ($exceptionHandler, $q) {
    return {
        responseError: function responseError(rejection) {
            $exceptionHandler("An HTTP request error has occurred.\nHTTP config: " + JSON.stringify(rejection.config) + ".\nStatus: " + rejection.status);
            return $q.reject(rejection);
        }
    };
});


app.controller('LinksController', function ($scope, $http, $timeout, $route, $location) {

    $scope.ResponsiveMenuActive = false;
    $scope.SetResponsiveMenuActive = function () {
        $scope.ResponsiveMenuActive = $scope.ResponsiveMenuActive == false ? true : false;
    };
    $scope.Admin = sessionStorage.getItem("Admin");

    $scope.loader = true;

    $scope.GetLinks = function () {
        $scope.params = {};
        $scope.params.action = 'Admin';
        $scope.params.Id = sessionStorage.getItem("Uid");

        var reqlinks = {
            method: 'POST',
            url: "../api/Site/MainLinks",
            data: { Info: EncriptInfo(JSON.stringify($scope.params)) }
        };
        $http(reqlinks)
           .success(function (linksdata) {
               $scope.AdminLinks = linksdata;
               $scope.loader = false;
           });
    };
    $scope.GetLinks();
    //$rootScope.$on('ReloadLonks', function () {       
    //        $scope.GetLinks();        
    //});

    $scope.LinkClick = function (parent) {
        if ($scope.Parent !== parent)
            $scope.Parent = parent;
        else
            $scope.Parent = 0;
    };
    $scope.PageRedirection = function (childid, disppage) {
        $scope.ResponsiveMenuActive = false;
        $scope.ChildId = childid;
        window.location.href = '#/' + disppage;
        $timeout(function () { $route.reload(), $('.modal-backdrop').remove(); }, 0);
    };
    $scope.menudis = false;
});

app.controller('LogoutCtrl', function ($scope, $http) {
    if (isUndefinedOrNull(sessionStorage.getItem("Uid")) != '') {
        $scope.GetLoginparams = {};
        $scope.GetLoginparams.uid = sessionStorage.getItem("Uid");
        $scope.GetLoginparams.usertype = 'Admin';

        var req = {
            method: 'POST',
            url: "../api/Site/LastLogin",
            data: { Info: EncriptInfo(JSON.stringify($scope.GetLoginparams)) }
        };
        $http(req)
           .success(function (Response) {

               $scope.username = Response[0].username;
               $scope.Name = Response[0].Name;
               $scope.Designation = Response[0].Designation;
           });
    }
    else {
        window.location = "../Login.html";
    }
    $scope.LogOut = function () {
        $scope.logoutsparams = {};
        $scope.logoutsparams.action = 'Up';
        $scope.logoutsparams.loginid = sessionStorage.getItem("Uid");
        $scope.logoutsparams.usertype = 'Admin';
        $scope.logoutsparams.sesid = sessionStorage.getItem("Sesid");
        var req = {
            method: 'POST',
            url: "../api/Login/SessionsInOut",
            data: { Info: EncriptInfo(JSON.stringify($scope.logoutsparams)) }
        };
        $http(req)
           .success(function (Response) {
               sessionStorage.removeItem("Uid");

               sessionStorage.removeItem("Sesid");

               window.location = "../Login.html";
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
});

//Profile Tools

//User Manager
app.controller('CreateUserCtrl', function ($scope, $http, dataService) {
    $scope.ShowUserProfile = "Create Employee";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.distxtname = false;
    $scope.chkInCharge = 0;
    $scope.chkAdmin = 0;
    $scope.txtusername = '';
    $scope.txtpassword = '';
    $scope.txtcnfpassword = '';
    $scope.Status = [{ Value: 0, Text: 'InActive' }, { Value: 1, Text: 'Active' }];
    $scope.Stat = 1;
    if (isUndefinedOrNull(dataService.UserId) != '') {

        $scope.ShowUserProfile = "Edit Employee  / " + dataService.UserId;
        $scope.distxtname = true;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Site/GetUsers",
            params: { Uid: dataService.UserId, Action: 'Edit', DeletedBy: 0 }
        };
        $http(reqEdit)
               .success(function (Response) {
                   $scope.HidePwd = false;
                   $scope.txtCreatedBy = Response[0]["CreatedBy"]
                   $scope.txtname = Response[0]["Name"]
                   $scope.txtmobile = Response[0]["PhoneNo"]
                   $scope.Address = Response[0]["Address"]
                   $scope.Email = Response[0]["EmailID"]
                   $scope.PF = Response[0]["PF"]
                   $scope.ESI = Response[0]["ESI"]
                   $scope.Aadhar = Response[0]["Aadhar"]
                   if (Response[0]["InCharge"] == 1) {
                       $scope.chkInCharge = 1;
                   }

                   if (Response[0]["IsAdmin"] == 1) {
                       $scope.chkAdmin = 1;
                   }

                   $scope.txtusername = Response[0]["UserName"]
                   $scope.txtpassword = "a12345699";
                   $scope.txtcnfpassword = "a12345699";
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 1 : 0
               });
    }
    $scope.CreateUserPro = function () {
        if ($scope.txtpassword != $scope.txtcnfpassword) {
            alertify.alert("Password and Confirm Password Should Be Same");
            return false;
        }

        var reqCreateUserPro = {
            method: 'POST',
            url: "../api/Site/CreateOrUpdateUser",
            params: {
                Uid: 0,
                Action: "IN",
                Name: $scope.txtname,
                Mobile: $scope.txtmobile,
                PF: $scope.PF,
                ESI: $scope.ESI,
                Aadhar: $scope.Aadhar,
                Email: $scope.Email,
                Address: $scope.Address,
                IsInCharge: $scope.chkInCharge,
                IsAdmin: $scope.chkAdmin,
                UserName: $scope.txtusername,
                Password: $scope.txtpassword,
                CreatedBy: sessionStorage.getItem("Uid"),
                Flag: 0,
                LastUpdatedBy: 0,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqCreateUserPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == -1) {
                   alertify.alert("Username Should Be Unique");
               }
               else {
                   alertify.alert("User Created");

                   $scope.txtCreatedBy = '';
                   $scope.txtname = '';
                   $scope.txtmobile = '';
                   $scope.Address = '';
                   $scope.Email = '';
                   $scope.PF = '';
                   $scope.ESI = '';
                   $scope.Aadhar = '';
                   $scope.chkInCharge = 0;
                   $scope.chkAdmin = 0;
                   window.location.href = "#/View-Employee";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Site/GetUsers",
                       params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }

           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    //  for update
    $scope.UpdateUserPro = function () {
        if ($scope.txtpassword != $scope.txtcnfpassword) {
            alertify.alert("Password and Confirm Password Should Be Same");
            return false;
        }
        var reqUpdateUserPro = {
            method: 'POST',
            url: "../api/Site/CreateOrUpdateUser",
            params: {
                Uid: dataService.UserId,
                Action: "Up",
                Name: $scope.txtname,
                Designation: $scope.Designation,
                DoorNo: $scope.txtdoorno,
                Email: $scope.txtemail,
                Mobile: $scope.txtmobile,
                UserName: $scope.txtusername,
                Password: $scope.txtpassword,
                CreatedBy: $scope.txtCreatedBy,
                Flag: $scope.Stat,
                LastUpdatedBy: sessionStorage.getItem("Uid"),
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqUpdateUserPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == 1) {
                   alertify.alert("User Updated Successfully");
                   window.location.href = "#/User-Report";
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.ShowReport = function () {
        window.location.href = "#/View-Employee";
    }
});
app.controller('UserReportCtrl', function ($scope, $http, dataService) {
    dataService.UserId = "";
    $scope.Status = 'Active';
    $scope.UserHdr = "Employee Report";
    $scope.loader = true;
    var reqUsers = {
        method: 'GET',
        url: "../api/Site/GetUsers",
        params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
    };
    $http(reqUsers)
       .success(function (data) {
           $scope.Users = data.filter(function (element) { return element.Flag == $scope.Status; });
           $scope.loader = false;
           //  alert(data);
       });


    $scope.ItemsperPage = 10;


    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditUser = function (Sid) {
        dataService.UserId = Sid;
        window.location.href = "#/Create-Employee";
    }
    $scope.LinksPremission = function (username) {
        $scope.username = username;

        $scope.MainLinksparams = {};
        $scope.MainLinksparams.uid = $scope.username.toString();
        $scope.MainLinksparams.usertype = 'Admin';
        $scope.MainLinksparams.action = 'Main';

        var reqLinksPremission = {
            method: 'POST',
            url: "../api/Site/LinksPremission",
            data: { Info: EncriptInfo(JSON.stringify($scope.MainLinksparams)) }
        };
        $http(reqLinksPremission)
           .success(function (data) {
               $scope.mainLinks = data;
               $scope.Linkpermview = true;
           });

        $scope.SubLinksparams = {};
        $scope.SubLinksparams.uid = $scope.username.toString();
        $scope.SubLinksparams.usertype = 'Admin';
        $scope.SubLinksparams.action = 'Sub';

        var reqLinksPremission = {
            method: 'POST',
            url: "../api/Site/LinksPremission",
            data: { Info: EncriptInfo(JSON.stringify($scope.SubLinksparams)) }
        };
        $http(reqLinksPremission)
           .success(function (data) {
               $scope.SubLinks = data;
           });

    };
    $scope.UpdateCheckBoxVal = function (index, event) {
        var checkbox = event.target;
        $scope.SubLinks[index]["flag"] = checkbox.checked ? '1' : '0';
    };
    $scope.UpdateLinkPermisions = function () {

        var Lids = ''
        angular.forEach($scope.SubLinks, function (item) {
            if (item.flag == 1 && parseInt(item.Parent) > 0) {
                Lids = Lids + item.Lid + ',';
            };
        });

        $scope.UpLnkPremissionparams = {};
        $scope.UpLnkPremissionparams.uid = $scope.username.toString();
        $scope.UpLnkPremissionparams.usertype = 'Admin';
        $scope.UpLnkPremissionparams.lids = Lids.toString();
        $scope.UpLnkPremissionparams.Updatedby = sessionStorage.getItem('Uid');
        $scope.UpLnkPremissionparams.sessid = '';

        var reqLinksPremission = {
            method: 'POST',
            url: "../api/Site/UpdateLinksPremission",
            data: { Info: EncriptInfo(JSON.stringify($scope.UpLnkPremissionparams)) }
        };

        $http(reqLinksPremission)
           .success(function (data) {
               alertify.alert('Links Permission Updated Successfully');
               $scope.Links = '';
               $scope.Linkpermview = false;
           })
        .error(function (Error) {
            alertify.alert(Error.Message);
        });
    };
    $scope.GtoToUserReport = function () {
        $scope.Linkpermview = false;
        $scope.username = 0;
        $scope.Links = '';
    };

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.Users, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                UserName: item.UserName,
                Name: item.Name,
                Mobile: item.Mobile,
                Flag: item.Flag
            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.UserHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "User-Report-" + GetCurrDate() + ".xls");
        };
    };
    $scope.StatusChanged = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Site/GetUsers",
            params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Users = data.filter(function (element) { return element.Flag == $scope.Status; });
               $scope.loader = false;

           });

    };

    $scope.UserAdd = function () {
        window.location.href = "#/Create-Employee";
    }
});
app.controller('ChangePasswordCtrl', function ($scope, $http) {
    $scope.Username = sessionStorage.getItem('Admin');
    $scope.checkConfirmPwd = function () {
        if ($scope.txtcnfpassword != '') {
            if ($scope.txtnewpassword != $scope.txtcnfpassword) {
                $scope.ConfirmPassword = true;
            }
            else {
                $scope.ConfirmPassword = false;
            };
        };
    };
    $scope.ChangePassword = function () {
        var reqChangePwd = {
            method: 'POST',
            url: "../api/Site/ChangePassword",
            params: { action: 'ChgAdminPwd', Idno: '', Name: '', Mobile: '', regid: sessionStorage.getItem("Uid"), thru: sessionStorage.getItem("Uid"), opwd: $scope.txtexistingpwd, npwd: $scope.txtnewpassword, sessid: sessionStorage.getItem('Sesid') }
        };
        $http(reqChangePwd)
          .success(function (Response) {
              alertify.alert(Response[0].result);
              $scope.txtexistingpwd = '';
              $scope.txtnewpassword = '';
              $scope.txtcnfpassword = '';
              $scope.Form_ChangePassword.$setPristine();
          })
          .error(function (Message) {
              alertify.alert(Message.Message);
          });
    };
});
app.controller('ResetPasswordCtrl', function ($scope, $http) {

    $scope.loader = false;
    document.getElementById("btnresetlpwd").disabled = false;

    $('#myModal').modal('show');
    $scope.popupclose = function () {
        $('#myModal').modal('hide');
    }
    $scope.CheckUserID = function () {

        document.getElementById("btncheckuserid").disabled = true;
        $scope.ResetParams = {};
        $scope.ResetParams.action = 'Profile';
        $scope.ResetParams.idno = $scope.txtidno;
        var reqCheckUserID = {
            method: 'Post',
            url: "../api/Site/CheckUserID",
            data: { Info: EncriptInfo(JSON.stringify($scope.ResetParams)) }
        };
        $http(reqCheckUserID)
           .success(function (Response) {

               $scope.regid = Response[0].regid;
               if ($scope.regid != "0") {
                   $('#myModal').modal('hide');

                   var reqEdit = {
                       method: 'GET',
                       url: "../api/Site/GetUsers",
                       params: { Uid: $scope.regid, Action: 'Edit', DeletedBy: 0 }
                   };
                   $http(reqEdit)
                          .success(function (Response) {
                              $scope.txtname = Response[0]["Name"]
                              $scope.Designation = Response[0]["Designation"]
                              $scope.txtmobile = Response[0]["Mobile"]
                              $scope.txtusername = Response[0]["UserName"]
                          });

                   document.getElementById("btncheckuserid").disabled = false;
                   document.getElementById("btnresetlpwd").disabled = false;
                   document.getElementById("btnresettpwd").disabled = false;
               }
               else {
                   document.getElementById("btncheckuserid").disabled = false;
                   alertify.alert(Response[0].result)
               };
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };

    $scope.LoadUsers = function () {
        $scope.Designations = '';
        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'Users';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Site/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Users = data;
               }
               else {
                   $scope.Users = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadUsers();

    $scope.ChangePassword = function (action) {
        var reqChangePwd = {
            method: 'POST',
            url: "../api/Site/ChangePassword",
            params: { action: action, Idno: '', Name: '', Mobile: $scope.txtmobile, regid: $scope.regid, thru: sessionStorage.getItem("Uid"), opwd: '', npwd: '', sessid: sessionStorage.getItem('Sesid') }
        };
        $http(reqChangePwd)
          .success(function (Response) {
              $scope.resetpwdresult = Response[0];
              $scope.loader = false;
              document.getElementById("btnresetlpwd").disabled = false;

              if ($scope.resetpwdresult.result == "Login Password Reset Successfully") {
                  alertify.alert($scope.resetpwdresult.result);
              }
          })
          .error(function (Message) {
              alertify.alert(Message.Message);
          });
    };

});

app.controller("SimplePhotos_RptCtrl", function ($scope, $http, $filter, dataService) {
    dataService.ID = "";
    $scope.Header = "Simple Photos";
    $scope.IsAdmin = sessionStorage.getItem("IsAdmin");
    $scope.loader = true;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;

    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    var fromdate = new Date()
    var From = fromdate.setMonth(fromdate.getMonth() - 1);

    $scope.fromtoRequired = true;
    $scope.openfromdatests = function ($event) {
        $scope.fromdatests.opened = true;
    };
    $scope.fromdatests = {
        opened: false
    };
    $scope.opentodatests = function ($event) {
        $scope.todatests.opened = true;
    };
    $scope.todatests = {
        opened: false
    };
    $scope.Assignfrommaxdate = function () {
        $scope.frommaxDate = $scope.txtTodate;
    };
    $scope.Assignfrommaxdate1 = function () {
        var mn = new Date($scope.txtFromdate)
        $scope.minDate1 = $filter('date')(mn, 'MM/dd/yyyy');
    };

    $scope.reqReport = function () {

        $scope.loader = true;
        $scope.RptHeader = "Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')

        $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
        $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');

        var req_Report = {
            method: 'GET',
            url: "../api/Site/GetSimplePhotos",
            params: { fromdate: $scope.fromdate ? $scope.fromdate : '', todate: $scope.todate ? $scope.todate : '' }
        };
        $http(req_Report)
         .success(function (Response) {
             $scope.ReportList = Response.ordered_products;
             $scope.loader = false;
         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };
    $scope.reqReport();

    $scope.ImportReport = function () {
        $scope.loader = true;
        $scope.RptHeader = "Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')

        $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
        $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');

        var req_Report = {
            method: 'GET',
            url: "../api/Site/GetSimplePhotos_Import",
            params: { fromdate: $scope.fromdate ? $scope.fromdate : '', todate: $scope.todate ? $scope.todate : '' }
        };
        $http(req_Report)
         .success(function (Response) {
             $scope.ReportList = Response.ordered_products;

             $scope.loader = false;
         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };
});

app.controller("GetPhotos_RptCtrl", function ($scope, $http, $filter, dataService) {
    dataService.ID = "";
    $scope.Header = "Get Photos";
    $scope.IsAdmin = sessionStorage.getItem("IsAdmin");

    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;

    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    var fromdate = new Date()
    var From = fromdate.setMonth(fromdate.getMonth() - 1);

    $scope.fromtoRequired = true;
    $scope.openfromdatests = function ($event) {
        $scope.fromdatests.opened = true;
    };
    $scope.fromdatests = {
        opened: false
    };
    $scope.opentodatests = function ($event) {
        $scope.todatests.opened = true;
    };
    $scope.todatests = {
        opened: false
    };
    $scope.Assignfrommaxdate = function () {
        $scope.frommaxDate = $scope.txtTodate;
    };
    $scope.Assignfrommaxdate1 = function () {
        var mn = new Date($scope.txtFromdate)
        $scope.minDate1 = $filter('date')(mn, 'MM/dd/yyyy');
    };

    $scope.reqReport = function () {

        $scope.loader = true;
        $scope.RptHeader = "Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')

        $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
        $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');

        var req_Report = {
            method: 'GET',
            url: "../api/Site/GetPhotos"
            //params: { fromdate: $scope.fromdate ? $scope.fromdate : '', todate: $scope.todate ? $scope.todate : '' }
        };
        $http(req_Report)
         .success(function (Response) {
             
             $scope.ReportList = Response;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };
    $scope.reqReport();
    $scope.ImportReport = function () {
        $scope.loader = true;
        $scope.RptHeader = "Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')

        $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
        $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');

        var req_Report = {
            method: 'GET',
            url: "../api/Site/GetPhotos_Import"
            //params: { fromdate: $scope.fromdate ? $scope.fromdate : '', todate: $scope.todate ? $scope.todate : '' }
        };
        $http(req_Report)
         .success(function (Response) {

             $scope.ReportList = Response;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    }

});





