
var app = angular.module('AdminApp', ['ngRoute', 'angularUtils.directives.dirPagination', 'ui.bootstrap', 'ngSanitize', 'Alertify', 'infinite-scroll']);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
        .when('/', { templateUrl: 'Index.html' })

         // User Manager
        .when('/Create-User', { templateUrl: 'CreateUser.html' })
        .when('/User-Report', { templateUrl: 'UserReport.html' })
        .when('/User-Login-Report', { templateUrl: 'UserLoginReport.html' })
        .when('/Change-Password', { templateUrl: 'ChangePassword.html' })
        .when('/Reset-Passward', { templateUrl: 'ResetPassword.html' })

        // Masters
        .when('/Unit-Master', { templateUrl: 'UnitMaster.html' })
        .when('/Item-Type', { templateUrl: 'ItemType.html' })
        .when('/Items', { templateUrl: 'Items.html' })
        .when('/Inward-Types', { templateUrl: 'InwardTypes.html' })

        .when('/Unit-Report', { templateUrl: 'UnitReport.html' })
        .when('/ItemType-Report', { templateUrl: 'ItemTypeReport.html' })
        .when('/Items-Report', { templateUrl: 'ItemsReport.html' })
        .when('/InwardType-Report', { templateUrl: 'InwardTypeReport.html' })


        // Store Manager
        .when('/Inward', { templateUrl: 'Inward.html' })
        .when('/Outward', { templateUrl: 'Outward.html' })


        // Reports
        .when('/Inward-Report', { templateUrl: 'InwardReport.html' })
        .when('/Outward-Report', { templateUrl: 'OutwardReport.html' })
        .when('/Balance-Report', { templateUrl: 'BalanceReport.html' })
        .when('/Supply-Statement', { templateUrl: 'SupplyStatement.html' })
        .when('/Material-Statement', { templateUrl: 'MaterialStatement.html' })
        .when('/ReturnToStore', { templateUrl: 'ReturnToStore.html' })


        .when('/0', { templateUrl: 'LogOut.html' })
         .otherwise({
             redirectTo: function () {
                 window.location = "Login.html";
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

                   window.location = "Login.html";
               });
        }
        else {
            sessionStorage.removeItem("Uid");
            sessionStorage.setItem("Admin", null);
            sessionStorage.setItem("Sesid", null);

            window.location = "Login.html";
        }
    }

    function TimeOut_Resetter(e) {
        /// Stop the pending timeout
        $timeout.cancel(TimeOut_Thread);

        /// Reset the timeout
        TimeOut_Thread = $timeout(function () { LogoutByTimer(); }, TimeOutTimerValue);
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
        if (isUndefinedOrNull(sessionStorage.getItem("Uid")) == '') {
            window.location = "Login.html";
        }
    }
    function TimeOut_Resetter1(e) {
        TimeOut_Thread1 = $timeout(function () { LogoutByTimer1() }, 0);
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
            url: "../api/Admin/MainLinks",
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
            url: "../api/Common/LastLogin",
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
        window.location = "Login.html";
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

               window.location = "Login.html";
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
});

//Profile Tools
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
            url: "../api/Admin/CheckUserID",
            data: { Info: EncriptInfo(JSON.stringify($scope.ResetParams)) }
        };
        $http(reqCheckUserID)
           .success(function (Response) {

               $scope.regid = Response[0].regid;
               if ($scope.regid != "0") {
                   $('#myModal').modal('hide');

                   var reqEdit = {
                       method: 'GET',
                       url: "../api/Admin/GetUsers",
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
            url: "../api/Common/Dropdown",
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
            url: "../api/Common/ChangePassword",
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
app.controller('AppPhotoReqCtrl', function ($scope, $http) {
    $scope.overlayloader = true;
    $scope.GetMemberPhotoPenReqs = function () {
        var reqMemberPhotoPenReqs = {
            method: 'POST',
            url: "../api/Admin/MemberPhotoPenReq"
        }
        $http(reqMemberPhotoPenReqs)
        .success(function (resulat) {
            $scope.MemberPhotoPenReqs = resulat;
            $scope.overlayloader = false;
        })
        .error(function () {
            $scope.overlayloader = false;
        });
    };
    $scope.GetMemberPhotoPenReqs();
    $scope.BindApprove = function (index, approve, reject, remarks) {
        $scope.MemberPhotoPenReqs[index]["Approve"] = approve;
        $scope.MemberPhotoPenReqs[index]["Reject"] = reject;
        if (reject == 2) {
            $scope.MemberPhotoPenReqs[index]["Required"] = 1;
        } else {
            $scope.MemberPhotoPenReqs[index]["Required"] = 0;
        }
        if (approve > 0 || reject > 0)
            $scope.MemberPhotoPenReqs[index]["Remarks"] = isUndefinedOrNull(remarks);
    };
    $scope.BindRemarks = function (index, remarks) {
        if ($scope.MemberPhotoPenReqs[index]["Approve"] > 0 || $scope.MemberPhotoPenReqs[index]["Reject"] > 0)
            $scope.MemberPhotoPenReqs[index]["Remarks"] = isUndefinedOrNull(remarks);
    };
    $scope.UpdatePhotoReq = function () {
        //document.getElementById("btnsubmit").disabled = true;
        $scope.UpdatePhotoPenReqs = [];
        angular.forEach($scope.MemberPhotoPenReqs, function (value) {
            if (value.Approve > 0 || value.Reject > 0) {
                var status = 0
                if (value.Approve > 0)
                    status = 1
                else
                    status = 2
                $scope.UpdatePhotoPenReqs.push({ slno: value.slno, remarks: value.Remarks, status: status });
            }
        });
        if ($scope.UpdatePhotoPenReqs.length > 0) {
            var reqMemberProfilePenReqAppRej = {
                method: 'POST',
                url: "../api/Admin/UpdateMemberPhotoPenReq",
                params: { jsonData: JSON.stringify($scope.UpdatePhotoPenReqs), updatedby: sessionStorage.getItem('Uid') }
            }
            $http(reqMemberProfilePenReqAppRej)
            .success(function (resulat) {
                $scope.MemberPhotoPenReqs = '';
                if (resulat == 'success') {

                    $scope.GetMemberPhotoPenReqs();
                    alertify.alert('Selected Records are updated Successfully');
                } else {
                    alertify.alert('Selected Records not are updated please try again');
                };
            })
        }
        else {
            alertify.alert('Please select atleast One Record');
        };
    };
});
app.controller('Block_UnBlock_IDCtrl', function ($scope, $http) {

    $('#myModal').modal('show');
    $scope.Header = "Block UnBlock ID";
    $scope.popupclose = function () {
        $('#myModal').modal('hide');
    }
    $scope.Activebtncheckuserid = function () {
        //document.getElementById("btncheckuserid").disabled = false;
        $scope.txtidno = "";
        $scope.IdForm.$setPristine();
    }
    document.getElementById("btnstsupdate").disabled = true;
    $scope.CheckUserID = function () {
        document.getElementById("btncheckuserid").disabled = true;

        $scope.ResetParams = {};
        $scope.ResetParams.action = 'Profile';
        $scope.ResetParams.idno = $scope.txtidno;

        var reqCheckUserID = {
            method: 'POST',
            url: "../api/Admin/CheckUserID",
            data: { Info: EncriptInfo(JSON.stringify($scope.ResetParams)) }
        };
        $http(reqCheckUserID)
           .success(function (Response) {
               $scope.regid = Response[0].regid;
               if ($scope.regid != "0") {
                   $('#myModal').modal('hide');
                   $scope.MemberProfile($scope.regid)
               }
               else {
                   alertify.alert(Response[0].result)
               };
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.MemberProfile = function (regid) {

        $scope.MemProfileParams = {};
        $scope.MemProfileParams.regid = parseInt(regid);

        var reqMemberProfile = {
            method: 'POST',
            url: "../api/Admin/MemberProfile",
            data: { Info: EncriptInfo(JSON.stringify($scope.MemProfileParams)) }
        };
        $http(reqMemberProfile)
           .success(function (Response) {
               $scope.Idno = Response[0]["Idno"]
               $scope.FirstName = Response[0]["FName"]
               $scope.City = $scope.txtCity = Response[0]["City"]
               $scope.Mobile = Response[0]["Mobile"]

               $scope.Mstatus = Response[0]["Mstatus"]
               //$scope.stsid = Response[0]["stsid"]
               //$scope.ddlstatus = Response[0]["stsid"]
               //$scope.stsidchk = Response[0]["stsid"]
               $scope.ddlstatus = Response[0]["stsid"] == 3 ? 1 : 3;
               $scope.stsid = $scope.stsidchk = Response[0]["stsid"];
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.BlockorUnBlockMemSts = function () {

        if ($scope.ddlstatus != $scope.stsidchk) {
            document.getElementById("btnstsupdate").disabled = true;

            $scope.BlkUblkparams = {};
            $scope.BlkUblkparams.regid = $scope.regid;
            $scope.BlkUblkparams.remarks = $scope.txtremarks;
            $scope.BlkUblkparams.thru = sessionStorage.getItem('Uid');
            $scope.BlkUblkparams.Sesid = sessionStorage.getItem('Sesid');
            $scope.BlkUblkparams.Status = parseInt($scope.ddlstatus);
            $scope.BlkUblkparams.Action = 'BlockUnblock';
            $scope.BlkUblkparams.FileName = '';

            var reqBlockorUnBlockMemSts = {
                method: 'POST',
                url: "../api/Admin/UpdateMemberSts",
                data: { Info: EncriptInfo(JSON.stringify($scope.BlkUblkparams)) }
            };
            $http(reqBlockorUnBlockMemSts)
               .success(function (Response) {
                   if (Response != '') {
                       $scope.MemberProfile($scope.regid)
                       alertify.alert(Response);
                       //document.getElementById("btnstsupdate").disabled = true;
                       $scope.txtremarks = '';
                       $scope.formsts.$setPristine();
                   }
                   else {
                       //document.getElementById("btnstsupdate").disabled = false;
                       alertify.alert('Server error, Please try again');
                   };
               })
               .error(function (Message) {
                   document.getElementById("btnstsupdate").disabled = false;
                   alertify.alert(Message.Message);
               });
        }
        else {
            alertify.alert('Present Status and Update Status should not be Same.');
        }
    };
});


//User Manager
app.controller('CreateUserCtrl', function ($scope, $http, dataService) {
    $scope.ShowUserProfile = "Create User";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.distxtname = false;
    $scope.LoadDesignations = function () {
        $scope.Designations = '';
        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'Designations';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Designations = data;
               }
               else {
                   $scope.Designations = "";
               }
           })
        .error(function (data, status, headers, config) {
            alert(status)
        });

    }
    $scope.LoadDesignations();


    $scope.Status = [{ Value: 0, Text: 'Active' }, { Value: 1, Text: 'InActive' }];
    $scope.Stat = 0;
    if (isUndefinedOrNull(dataService.UserId) != '') {

        $scope.ShowUserProfile = "Edit User  / " + dataService.UserId;
        $scope.distxtname = true;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Admin/GetUsers",
            params: { Uid: dataService.UserId, Action: 'Edit', DeletedBy: 0 }
        };
        $http(reqEdit)
               .success(function (Response) {
                   $scope.txtCreatedBy = Response[0]["CreatedBy"]
                   $scope.txtname = Response[0]["Name"]
                   $scope.txtdoorno = Response[0]["Address1"]
                   $scope.Designation = Response[0]["Designation"]
                   $scope.txtemail = Response[0]["Email"]
                   $scope.txtmobile = Response[0]["Mobile"]
                   $scope.txtusername = Response[0]["UserName"]
                   $scope.txtpassword = "a12345699";
                   $scope.txtcnfpassword = "a12345699";
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 0 : 1
               });
    }
    $scope.CreateUserPro = function () {
        if ($scope.txtpassword != $scope.txtcnfpassword) {
            alertify.alert("Password and Confirm Password Should Be Same");
            return false;
        }

        var reqCreateUserPro = {
            method: 'POST',
            url: "../api/Admin/CreateOrUpdateUser",
            params: {
                Uid: 0,
                Action: "IN",
                Name: $scope.txtname,
                Designation: $scope.Designation,
                DoorNo: $scope.txtdoorno,
                Email: $scope.txtemail,
                Mobile: $scope.txtmobile,
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
                   $scope.txtname = ""; $scope.txtdoorno = "";
                   $scope.txtemail = ""; $scope.txtmobile = ""; $scope.txtusername = ""; $scope.txtpassword = ""; $scope.txtcnfpassword = "";

                   window.location.href = "#/User-Report";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Admin/GetUsers",
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
            url: "../api/Admin/CreateOrUpdateUser",
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
        window.location.href = "#/User-Report";
    }
});
app.controller('UserReportCtrl', function ($scope, $http, dataService) {
    dataService.UserId = "";
    $scope.Status = 'Active';
    $scope.UserHdr = "User Report";
    $scope.loader = true;
    var reqUsers = {
        method: 'GET',
        url: "../api/Admin/GetUsers",
        params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
    };
    $http(reqUsers)
       .success(function (data) {
           $scope.Users = data.filter(function (element) { return element.Flag == $scope.Status; });
           $scope.loader = false;
           //  alert(data);
       });


    $scope.ItemsperPage = 10;
    $scope.DeleteUser = function (Sid) {
        $scope.DeleteRecordId = Sid;
        $scope.Model = true;
    }

    $scope.SDeleteConf = function () {
        if (!$scope.DeleteRecordId) { return; }
        $scope.DeleteRecordId;
        var reqStates = {
            method: 'GET',
            url: "../api/Admin/GetUsers",
            params: { Uid: $scope.DeleteRecordId, Action: 'Delete', DeletedBy: sessionStorage.getItem("Uid") }
        };
        $http(reqStates)
           .success(function (Response) {
               if (Response[0]["result"] == "Deleted") {
                   alertify.alert("User Deleted");
                   $("#myModal").modal('hide');
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Admin/GetUsers",
                       params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }
           });
    }

    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditUser = function (Sid) {
        dataService.UserId = Sid;
        window.location.href = "#/Create-User";
    }
    $scope.LinksPremission = function (username) {
        $scope.username = username;

        $scope.MainLinksparams = {};
        $scope.MainLinksparams.uid = $scope.username.toString();
        $scope.MainLinksparams.usertype = 'Admin';
        $scope.MainLinksparams.action = 'Main';

        var reqLinksPremission = {
            method: 'POST',
            url: "../api/Admin/LinksPremission",
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
            url: "../api/Admin/LinksPremission",
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
            url: "../api/Admin/UpdateLinksPremission",
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
            url: "../api/Admin/GetUsers",
            params: { Uid: 0, Action: 'GetUsers', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Users = data.filter(function (element) { return element.Flag == $scope.Status; });
               $scope.loader = false;

           });

    };

    $scope.UserAdd = function () {
        window.location.href = "#/Create-User";
    }
});
app.controller('UserLoginReportCtrl', function ($scope, $http, $filter) {
    locale = "en-us"
    $('#myModal').modal('show');
    $scope.Header = 'Userlogin Report';
    $scope.OnRequired = false;
    $scope.fromtoRequired = false;
    $scope.loader = false;
    $scope.ItemsperPage = 10;
    $scope.minDate = '01/01/2000';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.BindDatatoUsers = function (usertype) {
        $scope.UserDataparams = {};
        $scope.UserDataparams.UserType = usertype;
        var reqUsers = {
            method: 'Post',
            url: "../api/Admin/UsersData",
            data: { Info: EncriptInfo(JSON.stringify($scope.UserDataparams)) }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.tableusers = data;
           });
    }

    $scope.openondatests = function ($event) {
        $scope.ondatests.opened = true;
    };
    $scope.ondatests = {
        opened: false
    };
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
    $scope.AssignValidations = function () {
        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {
            $scope.OnRequired = true;
            $scope.fromtoRequired = false;
            $scope.IdRequired = false;
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
            $scope.txtIdno = '';
        }
        else if (rbval == 'FromTo') {
            $scope.OnRequired = false;
            $scope.fromtoRequired = true;
            $scope.IdRequired = false;
            $scope.txtOndate = '';
            $scope.txtIdno = '';
        }
        else {
            $scope.OnRequired = false;
            $scope.fromtoRequired = false;
            $scope.IdRequired = false;
            $scope.txtOndate = '';
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
            $scope.txtIdno = '';
        };
    };
    $scope.GetUserLogin = function () {
        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {
            $scope.fromdate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
            $scope.todate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
            $scope.Header = "Userlogin Report - On : " + $filter('date')($scope.txtOndate, 'dd MMM yyyy');
        }
        else if (rbval == 'FromTo') {
            $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
            $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
            $scope.Header = "Userlogin Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')
        }
        else {
            $scope.fromdate = '01/01/2000';
            var todaydate = new Date()
            $scope.todate = $filter('date')(todaydate, 'MM/dd/yyyy');
        };
        $scope.loader = true;

        $scope.UserLoginRptparams = {};
        $scope.UserLoginRptparams.utype = $scope.ddlUtype;
        $scope.UserLoginRptparams.fromdate = $scope.fromdate;
        $scope.UserLoginRptparams.todate = $scope.todate;
        $scope.UserLoginRptparams.uid = $scope.ddlUsers;

        var req = {
            method: 'POST',
            url: "../api/Admin/UserLoginRpt",
            data: { Info: EncriptInfo(JSON.stringify($scope.UserLoginRptparams)) }
        };
        $http(req)
            .success(function (Response) {

                $('#myModal').modal('hide');
                $scope.ItemsperPage = 10;
                $scope.LoginDate = Response;

                $scope.loader = false;
            })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });

    };

    $scope.exportToExcel = function () {

        $scope.TemploginRpt = [];
        var sno = 1;
        angular.forEach($scope.LoginDate, function (item) {
            $scope.TemploginRpt.push({
                Sno: sno,//item.$id,
                UserName: item.username,
                SessionId: item.sesid,
                IPAddress: item.ipaddress,
                SessonIn: item.sesin,
                SessionOut: item.sesout
            });
            sno = sno + 1;
        });
        if ($scope.TemploginRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TemploginRpt, $scope.UserHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "User-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.popupclose = function () {
        $('#myModal').modal('hide');
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
            url: "../api/Common/ChangePassword",
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


///////////////////////////// Unit ////////////////////////////////////
app.controller('CreateUnitCtrl', function ($scope, $http, dataService) {
    $scope.ShowUnit = "Create Unit";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.unitnamedis = false;
    $scope.Status = [{ Value: 0, Text: 'Active' }, { Value: 1, Text: 'InActive' }];
    $scope.Stat = 0;

    if (isUndefinedOrNull(dataService.UnitId) != '') {
        $scope.unitnamedis = true;
        $scope.ShowUserProfile = "Edit Unit  / " + dataService.UnitId;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Stores/GetUnits",
            params: { Unitid: dataService.UnitId, Action: 'Edit', DeletedBy: 0 }
        };
        $http(reqEdit)
               .success(function (Response) {
                   $scope.txtUnitName = Response[0]["UnitName"]
                   $scope.txtUnitDescr = Response[0]["UnitDescr"]
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 0 : 1
               });
    }
    $scope.CreateUnitPro = function () {
        var reqCreateUnitPro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateUnit",
            params: {
                Unitid: 0,
                Action: "IN",
                UnitName: $scope.txtUnitName,
                UnitDescr: $scope.txtUnitDescr ? $scope.txtUnitDescr : '',
                CreatedBy: 1,
                Flag: 0,
                LastUpdatedBy: 0,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqCreateUnitPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == -1) {
                   alertify.alert("Unit Name Should Be Unique");
               }
               else {
                   alertify.alert("Unit Created");
                   $scope.txtUnitName = ""; $scope.txtUnitDescr = "";

                   window.location.href = "#/Unit-Report";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetUnits",
                       params: { Unitid: 0, Action: 'GetUnits', DeletedBy: 0 }
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
    $scope.UpdateUnitPro = function () {

        var reqUpdateUnitPro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateUnit",
            params: {
                Unitid: dataService.UnitId,
                Action: "Up",
                UnitName: $scope.txtUnitName,
                UnitDescr: $scope.txtUnitDescr ? $scope.txtUnitDescr : '',
                CreatedBy: 1,
                Flag: $scope.Stat,
                LastUpdatedBy: sessionStorage.getItem("Uid"),
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqUpdateUnitPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == 1) {
                   dataService.UnitId = '';
                   alertify.alert("Unit Updated Successfully");
                   window.location.href = "#/Unit-Report";
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.ShowReport = function () {
        window.location.href = "#/Unit-Report";
    }
});

app.controller('UnitReportCtrl', function ($scope, $http, dataService) {
    dataService.UnitId = "";
    $scope.Status = 'Active';
    $scope.UnitHdr = "Unit Report";
    $scope.loader = true;
    var reqUsers = {
        method: 'GET',
        url: "../api/Stores/GetUnits",
        params: { UnitId: 0, Action: 'GetUnits', DeletedBy: 0 }
    };
    $http(reqUsers)
       .success(function (data) {
           $scope.Units = data.filter(function (element) { return element.Flag == $scope.Status; });
           $scope.loader = false;
           // alert(data);
       });

    $scope.StatusChanged = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetUnits",
            params: { UnitId: 0, Action: 'GetUnits', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Units = data.filter(function (element) { return element.Flag == $scope.Status; });
               $scope.loader = false;
               // alert(data);
           });
    };


    $scope.ItemsperPage = 10;
    $scope.DeleteUnit = function (Sid) {
        $scope.DeleteRecordId = Sid;
        $scope.Model = true;
    }

    $scope.SDeleteConf = function () {
        if (!$scope.DeleteRecordId) { return; }
        $scope.DeleteRecordId;
        var reqStates = {
            method: 'GET',
            url: "../api/Stores/GetUnits",
            params: { UnitId: $scope.DeleteRecordId, Action: 'Delete', DeletedBy: sessionStorage.getItem("Uid") }
        };
        $http(reqStates)
           .success(function (Response) {
               if (Response[0]["result"] == "Deleted") {
                   alertify.alert("Unit Deleted");
                   $("#myModal").modal('hide');
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetUsers",
                       params: { Uid: 0, Action: 'GetUnits', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }
           });
    }

    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditUnit = function (Sid) {
        dataService.UnitId = Sid;
        window.location.href = "#/Unit-Master";
    }

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.Units, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                UnitName: item.UnitName,
                UnitDescr: item.UnitDescr,
                Flag: item.Flag
            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.UnitHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Unit-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.UnitAdd = function () {
        window.location.href = "#/Unit-Master";
    }
});

///////////////////////////// Unit ////////////////////////////////////


///////////////////////////// ItemType ////////////////////////////////////
app.controller('CreateItemTypeCtrl', function ($scope, $http, dataService) {
    $scope.ShowItemType = "Create Item Type";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.ItemTypedis = false;
    $scope.Status = [{ Value: 0, Text: 'Active' }, { Value: 1, Text: 'InActive' }];
    $scope.Stat = 0;

    if (isUndefinedOrNull(dataService.ItemTypeID) != '') {

        $scope.ItemTypedis = true;
        $scope.ShowItemTypeProfile = "Edit Item Type  / " + dataService.ItemTypeID;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Stores/GetItemTypes",
            params: { ItemTypeID: dataService.ItemTypeID, Action: 'Edit', DeletedBy: 0 }
        };
        $http(reqEdit)
               .success(function (Response) {
                   $scope.txtItemTypeName = Response[0]["ItemTypeName"]
                   $scope.txtItemTypeDescr = Response[0]["ItemTypeDescr"]
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 0 : 1
               });
    }
    else {

    }
    $scope.CreateItemTypePro = function () {
        var reqCreateItemTypePro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateItemType",
            params: {
                ItemTypeID: 0,
                Action: "IN",
                ItemTypeName: $scope.txtItemTypeName,
                ItemTypeDescr: $scope.txtItemTypeDescr ? $scope.txtItemTypeDescr : '',
                CreatedBy: 1,
                Flag: 0,
                LastUpdatedBy: 0,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };


        $http(reqCreateItemTypePro)
           .success(function (Response) {
               if (Response[0]["cnt"] == -1) {
                   alertify.alert("Item Type Should Be Unique");
               }
               else {
                   alertify.alert("Item Type Created");
                   $scope.txtItemTypeName = ""; $scope.txtItemTypeDescr = "";

                   window.location.href = "#/ItemType-Report";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetItemTypes",
                       params: { ItemTypeID: 0, Action: 'GetItemTypes', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.ItemTypes = data;
                      });
               }

           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    //  for update
    $scope.UpdateItemTypePro = function () {

        var reqUpdateItemTypePro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateItemType",
            params: {
                ItemTypeID: dataService.ItemTypeID,
                Action: "Up",
                ItemTypeName: $scope.txtItemTypeName,
                ItemTypeDescr: $scope.txtItemTypeDescr ? $scope.txtItemTypeDescr : '',
                CreatedBy: 1,
                Flag: $scope.Stat,
                LastUpdatedBy: 1,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqUpdateItemTypePro)
           .success(function (Response) {
               if (Response[0]["cnt"] == 1) {
                   dataService.ItemTypeID = '';
                   $scope.txtItemTypeName = ""; $scope.txtItemTypeDescr = "";
                   alertify.alert("Item Type Updated Successfully");
                   window.location.href = "#/ItemType-Report";
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.ShowReport = function () {
        window.location.href = "#/ItemType-Report";
    }
});

app.controller('ItemTypeReportCtrl', function ($scope, $http, dataService) {
    dataService.ItemTypeId = "";
    $scope.Status = 'Active';
    $scope.ItemTypeHdr = "ItemType Report";
    $scope.loader = true;
    var reqUsers = {
        method: 'GET',
        url: "../api/Stores/GetItemTypes",
        params: { ItemTypeId: 0, Action: 'GetItemTypes', DeletedBy: 0 }
    };
    $http(reqUsers)
       .success(function (data) {
           $scope.ItemTypes = data.filter(function (element) { return element.Flag == $scope.Status; });
           $scope.loader = false;
           // alert(data);
       });

    $scope.StatusChanged = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetItemTypes",
            params: { ItemTypeId: 0, Action: 'GetItemTypes', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.ItemTypes = data.filter(function (element) { return element.Flag == $scope.Status; });
               $scope.loader = false;
               // alert(data);
           });
    };

    $scope.ItemsperPage = 10;
    $scope.DeleteItemType = function (Sid) {
        $scope.DeleteRecordId = Sid;
        $scope.Model = true;
    }

    $scope.SDeleteConf = function () {
        if (!$scope.DeleteRecordId) { return; }
        $scope.DeleteRecordId;
        var reqStates = {
            method: 'GET',
            url: "../api/Stores/GetItemTypes",
            params: { ItemTypeId: $scope.DeleteRecordId, Action: 'Delete', DeletedBy: sessionStorage.getItem("Uid") }
        };
        $http(reqStates)
           .success(function (Response) {
               if (Response[0]["result"] == "Deleted") {
                   alertify.alert("ItemType Deleted");
                   $("#myModal").modal('hide');
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetUsers",
                       params: { Uid: 0, Action: 'GetItemTypes', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }
           });
    }

    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditItemType = function (Sid) {
        dataService.ItemTypeID = Sid;
        dataService.EditType = 'Edit';
        window.location.href = "#/Item-Type";
    }

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.ItemTypes, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                ItemTypeName: item.ItemTypeName,
                ItemTypeDescr: item.ItemTypeDescr,
                Flag: item.Flag
            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.ItemTypeHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "ItemType-Report-" + GetCurrDate() + ".xls");
        };
    };


    $scope.ItemTypeAdd = function () {
        window.location.href = "#/Item-Type";
    }
});

///////////////////////////// Ittem Type ////////////////////////////////////


///////////////////////////// Item ////////////////////////////////////
app.controller('CreateItemCtrl', function ($scope, $http, dataService) {
    $scope.ShowItem = "Create Item";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.hasSLNo = false;
    $scope.Unitdis = false;
    $scope.ItemNamedis = false;
    $scope.ItemTypedis = false;

    $scope.LoadItemTypes = function () {
        $scope.Type = "";
        $scope.ItemType = '';
        $scope.ItemName = "";

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'ItemTypes';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.ItemTypes = data;
               }
               else {
                   $scope.ItemType = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadItemTypes();

    $scope.Status = [{ Value: 0, Text: 'Active' }, { Value: 1, Text: 'InActive' }];
    $scope.Stat = 0;


    $scope.LoadUnits = function () {
        $scope.Unit = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetUnits';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Units = data;
               }
               else {
                   $scope.Units = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadUnits();


    if (isUndefinedOrNull(dataService.ItemID) != '') {


        $scope.Unitdis = true;
        $scope.ItemNamedis = true;
        $scope.ItemTypedis = true;

        $scope.ShowItemProfile = "Edit Item Type  / " + dataService.ItemID;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Stores/GetItems",
            params: { ItemID: dataService.ItemID, Action: 'Edit', DeletedBy: 0 }
        };
        $http(reqEdit)
               .success(function (Response) {
                   $scope.txtItemName = Response[0]["ItemName"]
                   $scope.txtItemDescr = Response[0]["ItemDescr"]
                   $scope.Item_Type = Response[0]["ItemTypeName"]
                   $scope.Unit = Response[0]["Unit"]
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 0 : 1
               });
    }
    $scope.CreateItemPro = function () {

        //if ($scope.hasSLNo) {
        //    $scope.hasSLNo1 = "Yes";
        //}
        //else { $scope.hasSLNo1 = "No"; }

        var reqCreateItemPro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateItem",
            params: {
                ItemID: 0,
                Action: "IN",
                ItemType: $scope.Item_Type,
                ItemName: $scope.txtItemName,
                ItemDescr: $scope.txtItemDescr ? $scope.txtItemDescr : '',
                CreatedBy: 1,
                Flag: 0,
                LastUpdatedBy: 0,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid"),
                Unit: $scope.Unit,
                hasSLNo: 'No'
            }
        };


        $http(reqCreateItemPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == -1) {
                   alertify.alert("Item Should Be Unique");
               }
               else {
                   alertify.alert("Item Created");
                   $scope.txtItemName = ""; $scope.txtItemDescr = "";

                   window.location.href = "#/Items-Report";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetItems",
                       params: { ItemID: 0, Action: 'GetItems', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Items = data;
                      });
               }

           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    //  for update
    $scope.UpdateItemPro = function () {

        if ($scope.hasSLNo) {
            $scope.hasSLNo1 = "Yes";
        }
        else { $scope.hasSLNo1 = "No"; }


        var reqUpdateItemPro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateItem",
            params: {
                ItemID: dataService.ItemID,
                Action: "Up",
                ItemType: $scope.Item_Type,
                ItemName: $scope.txtItemName,
                ItemDescr: $scope.txtItemDescr ? $scope.txtItemDescr : '',
                CreatedBy: 1,
                Flag: $scope.Stat,
                LastUpdatedBy: 1,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid"),
                Unit: $scope.Unit,
                hasSLNo: 'No'
            }
        };
        $http(reqUpdateItemPro)
           .success(function (Response) {
               if (Response[0]["cnt"] == 1) {
                   dataService.ItemID = '';
                   $scope.txtItemName = ""; $scope.txtItemDescr = ""; $scope.Item_Type = ""; $scope.Unit = "";
                   alertify.alert("Item Type Updated Successfully");
                   window.location.href = "#/Items-Report";
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.ShowReport = function () {
        window.location.href = "#/Items-Report";
    }
});

app.controller('ItemReportCtrl', function ($scope, $http, dataService) {
    dataService.ItemId = "";
    $scope.Item_Type = '';
    $scope.Status = 'Active';
    $scope.ItemHdr = "Item Report";
    $scope.loader = true;

    $scope.LoadItems = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetItems",
            params: { ItemId: 0, Action: 'GetItems', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Items = data.filter(function (element) { return element.Flag == $scope.Status; })

               $scope.loader = false;
               // alert(data);
           });

    };

    $scope.LoadItems();
    $scope.showbyGroup = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetItems",
            params: { ItemId: 0, Action: 'GetItems', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Items = data.filter(function (element) { return element.ItemTypeName == $scope.Item_Type && element.Flag == $scope.Status; })
           });

    };

    $scope.StatusChanged = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetItems",
            params: { ItemId: 0, Action: 'GetItems', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.Items = data.filter(function (element) { return element.ItemTypeName == $scope.Item_Type ? $scope.Item_Type : element.ItemTypeName && element.Flag == $scope.Status; })
           });
    };

    $scope.LoadItemTypes = function () {
        $scope.Type = "";
        $scope.ItemType = '';
        $scope.ItemName = "";

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'ItemTypes';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.ItemTypes = data;
               }
               else {
                   $scope.ItemType = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadItemTypes();

    $scope.ItemsperPage = 10;
    $scope.DeleteItem = function (Sid) {
        $scope.DeleteRecordId = Sid;
        $scope.Model = true;
    }

    $scope.SDeleteConf = function () {
        if (!$scope.DeleteRecordId) { return; }
        $scope.DeleteRecordId;
        var reqStates = {
            method: 'GET',
            url: "../api/Stores/GetItems",
            params: { ItemId: $scope.DeleteRecordId, Action: 'Delete', DeletedBy: sessionStorage.getItem("Uid") }
        };
        $http(reqStates)
           .success(function (Response) {
               if (Response[0]["result"] == "Deleted") {
                   alertify.alert("Item Deleted");
                   $("#myModal").modal('hide');
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetUsers",
                       params: { Uid: 0, Action: 'GetItems', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }
           });
    }

    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditItem = function (Sid) {
        dataService.ItemID = Sid;
        window.location.href = "#/Items";
    }

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.Items, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                ItemName: item.ItemName,
                ItemDescr: item.ItemDescr,
                Flag: item.Flag
            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.ItemHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Item-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.ItemAdd = function () {
        window.location.href = "#/Items";
    }
});

///////////////////////////// Ittem ////////////////////////////////////


///////////////////////////// InwardType ////////////////////////////////////
app.controller('CreateInwardTypeCtrl', function ($scope, $http, dataService) {
    $scope.ShowInwardType = "Create Type";
    $scope.ShowHideUpdate = false;
    $scope.ShowHideCreate = true;
    $scope.SHDropDown = false;
    $scope.HidePwd = true;
    $scope.truefalse = false;
    $scope.disType = false;
    $scope.disName = false;


    $scope.LoadInwardTypeTypes = function () {

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'InwardType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.InwardTypeTypes = data;
               }
               else {
                   $scope.Type = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadInwardTypeTypes();

    $scope.LoadDesignations = function () {
        $scope.Designations = '';
        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'Designations';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Designations = data;
               }
               else {
                   $scope.Designations = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadDesignations();

    $scope.CheckType = function () {
        if ($scope.Type == 'Staff') {
            $scope.showhideDesignation = true;
            $scope.Req_Desig = true;
        }
        else {
            $scope.showhideDesignation = false;
            $scope.Req_Desig = false;
        }
    };


    $scope.Status = [{ Value: 0, Text: 'Active' }, { Value: 1, Text: 'InActive' }];
    $scope.Stat = 0;

    if (isUndefinedOrNull(dataService.InwardTypeID) != '') {

        $scope.ShowInwardTypeProfile = "Edit InwardType Type  / " + dataService.InwardTypeID;
        $scope.ShowHideUpdate = true;
        $scope.ShowHideCreate = false;
        $scope.SHDropDown = true;
        $scope.HidePwd = false;
        $scope.truefalse = true;
        $scope.disType = true;
        $scope.disName = true;
        var reqEdit = {
            method: 'GET',
            url: "../api/Stores/GetInwardTypes",
            params: { InwardTypeID: dataService.InwardTypeID, Action: 'Edit', DeletedBy: 0 }
        };

        $http(reqEdit)
               .success(function (Response) {

                   $scope.Type = Response[0]["Type"]
                   $scope.txtname = Response[0]["Name"]
                   $scope.Designation = Response[0]["Designation"]
                   $scope.txtAddress = Response[0]["Address"]
                   $scope.txtmobile = Response[0]["Mobile"]
                   $scope.Stat = Response[0]["Flag"] == 'Active' ? 0 : 1
                   if ($scope.Type == 'Staff') {
                       $scope.showhideDesignation = true;
                       $scope.Req_Desig = true;
                   }
                   else {
                       $scope.showhideDesignation = false;
                       $scope.Req_Desig = false;
                   }
               });
    }

    $scope.CreateInwardTypePro = function () {

        var reqCreateInwardTypePro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateInwardType",
            params: {
                InwardTypeID: 0,
                Action: "IN",
                Type: $scope.Type,
                Name: $scope.txtname,
                Designation: $scope.Designation == null ? '' : $scope.Designation,
                Address: $scope.txtAddress ? $scope.txtAddress : '',
                Mobile: $scope.txtmobile ? $scope.txtmobile : '',
                CreatedBy: 1,
                Flag: 0,
                LastUpdatedBy: 0,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };


        $http(reqCreateInwardTypePro)
           .success(function (Response) {
               if (Response[0]["cnt"] == -1) {
                   alertify.alert("Combination of Type and Name  Should Be Unique");
               }
               else {
                   alertify.alert("Type Created");
                   $scope.txtInwardTypeName = ""; $scope.txtInwardTypeDescr = "";

                   window.location.href = "#/InwardType-Report";
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetInwardTypes",
                       params: { InwardTypeID: 0, Action: 'GetInwardTypes', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.InwardTypes = data;
                      });
               }

           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    //  for update
    $scope.UpdateInwardTypePro = function () {

        var reqUpdateInwardTypePro = {
            method: 'POST',
            url: "../api/Stores/CreateOrUpdateInwardType",
            params: {
                InwardTypeID: dataService.InwardTypeID,
                Action: "Up",
                Type: $scope.Type,
                Name: $scope.txtname,
                Designation: $scope.Designation == null ? '' : $scope.Designation,
                Address: $scope.txtAddress ? $scope.txtAddress : '',
                Mobile: $scope.txtmobile ? $scope.txtmobile : '',
                CreatedBy: 1,
                Flag: $scope.Stat,
                LastUpdatedBy: 1,
                DeletedBy: 0,
                sesid: sessionStorage.getItem("Sesid")
            }
        };
        $http(reqUpdateInwardTypePro)
           .success(function (Response) {
               if (Response[0]["cnt"] == 1) {
                   $scope.txtInwardTypeName = ""; $scope.txtInwardTypeDescr = "";
                   alertify.alert("InwardType Type Updated Successfully");
                   window.location.href = "#/InwardType-Report";
               }
           })
           .error(function (Message) {
               alertify.alert(Message.Message);
           });
    };
    $scope.ShowReport = function () {
        window.location.href = "#/InwardType-Report";
    }
});

app.controller('InwardTypeReportCtrl', function ($scope, $http, dataService) {
    dataService.InwardTypeId = "";
    $scope.Type = '';
    $scope.Status = 'Active';
    $scope.InwardTypeHdr = "InwardType Report";
    $scope.loader = true;
    var reqUsers = {
        method: 'GET',
        url: "../api/Stores/GetInwardTypes",
        params: { InwardTypeId: 0, Action: 'GetInwardTypes', DeletedBy: 0 }
    };
    $http(reqUsers)
       .success(function (data) {
           $scope.InwardTypes = data.filter(function (element) { return element.Flag == $scope.Status; })
           $scope.loader = false;
           // alert(data);
       });

    $scope.StatusChanged = function () {
        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetInwardTypes",
            params: { InwardTypeId: 0, Action: 'GetInwardTypes', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.InwardTypes = data.filter(function (element) { return element.Type == $scope.Type ? $scope.Type : element.Type && element.Flag == $scope.Status; })
               $scope.loader = false;
               // alert(data);
           });

    };


    $scope.LoadInwardTypeTypes = function () {

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'InwardType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.InwardTypeTypes = data;
               }
               else {
                   $scope.Type = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadInwardTypeTypes();
    $scope.showbyGroup = function () {

        var reqUsers = {
            method: 'GET',
            url: "../api/Stores/GetInwardTypes",
            params: { InwardTypeId: 0, Action: 'GetInwardTypes', DeletedBy: 0 }
        };
        $http(reqUsers)
           .success(function (data) {
               $scope.InwardTypes = data.filter(function (element) { return element.Type == $scope.Type && element.Flag == $scope.Status;; })
               $scope.loader = false;
               // alert(data);
           });

    };


    $scope.TypesperPage = 10;
    $scope.DeleteInwardType = function (Sid) {
        $scope.DeleteRecordId = Sid;
        $scope.Model = true;
    }

    $scope.SDeleteConf = function () {
        if (!$scope.DeleteRecordId) { return; }
        $scope.DeleteRecordId;
        var reqStates = {
            method: 'GET',
            url: "../api/Stores/GetInwardTypes",
            params: { InwardTypeId: $scope.DeleteRecordId, Action: 'Delete', DeletedBy: sessionStorage.getInwardType("Uid") }
        };
        $http(reqStates)
           .success(function (Response) {
               if (Response[0]["result"] == "Deleted") {
                   alertify.alert("InwardType Deleted");
                   $("#myModal").modal('hide');
                   var reqUsers = {
                       method: 'GET',
                       url: "../api/Stores/GetUsers",
                       params: { Uid: 0, Action: 'GetInwardTypes', DeletedBy: 0 }
                   };
                   $http(reqUsers)
                      .success(function (data) {
                          $scope.Users = data;
                      });
               }
           });
    }

    $scope.Cancel = function () {
        $("#myModal").modal('hide');
    }
    $scope.EditInwardType = function (Sid) {
        dataService.InwardTypeID = Sid;
        window.location.href = "#/Inward-Types";
    }

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.InwardTypes, function (InwardType) {
            $scope.TempInwardRpt.push({
                Sno: sno,//InwardType.$id,
                InwardTypeName: InwardType.InwardTypeName,
                InwardTypeDescr: InwardType.InwardTypeDescr,
                Flag: InwardType.Flag
            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.InwardTypeHdr);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "InwardType-Report-" + GetCurrDate() + ".xls");
        };
    };


    $scope.InwardTypeAdd = function () {
        window.location.href = "#/Inward-Types";
    }
});

///////////////////////////// End Item ////////////////////////////////////

///////////////////////////// Inward ///////////////////////////////////
app.controller('InwardCtrl', function ($scope, $q, $http, $filter, dataService) {
    $scope.SelectItemsstr = '';
    $scope.disunit = true;
    $scope.dispprds = true;
    $scope.regid = 0;
    $scope.DivProducts = true;
    $scope.SLNoShowHide = false;
    $scope.showhideSLNOSubmit = false;
    $('#InwardItemsModal').modal('hide');
    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();
    $scope.IsClasic = 'Class A';
    $scope.SelectItems = 'Select Items';
    $scope.ItemRemarks = '';
    $scope.SelectItemsstr = '';
    $scope.GetFromTypeNames = function () {

        $scope.FromTypeName = "";
        if (isUndefinedOrNull($scope.FromType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetFromTypeNames';
            $scope.GETCATEParams.Condition = $scope.FromType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.FromTypeNames = data
               })
        }
        else {
            $scope.FromTypeName = "";
        }
    };

    $scope.LoadItemTypes = function () {
        $scope.Type = "";
        $scope.ItemType = '';
        $scope.ItemName = "";

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'ItemTypes';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.ItemTypes = data;
               }
               else {
                   $scope.ItemType = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadItemTypes();

    $scope.popupclose = function () {
        $('#myModalhasSLNo').modal('hide');
    }

    $scope.DoD = function ($event) {
        $scope.ODOD.opened = true;
    };

    $scope.ODOD = {
        opened: false
    };

    $scope.SelectItemsList = [];
    $scope.AddItems = function () {

        if ($scope.ItemType != '' && $scope.IsClasic != '' && $scope.SelectItemsstr) {
            $scope.SelectItemsstr = $scope.SelectItemsstr + ":" + $scope.ItemType + "," + $scope.IsClasic + "," + $scope.ItemRemarks + '|';

            var reqCat = {
                method: 'GET',
                url: "../api/Stores/AddItemToGrid",
                params: { SelectedItems: $scope.SelectItemsstr }
            };
            $http(reqCat)
               .success(function (data) {

                   if (data != "") {

                       $scope.SelectItemsstr = $scope.SelectItemsstr;
                       $scope.SelectItemsList = data;
                       $scope.Addprds = true;
                       $scope.DivProducts = true;
                       $scope.ItemType = '';
                       $scope.IsClasic = 'Class A';
                       $scope.ItemRemarks = '';
                       $scope.addprdloader = false;
                       $scope.SelectItems = 'Select Items';
                       $scope.oldItemType = '';
                       $scope.Items = [];
                   }
                   else {
                       $scope.SelectItemsList = [];
                   }
               })
            .error(function (data, status, headers, config) {
            });
        }
        else {
            alertify.alert('Select All Mandatoty Fields.');
        }
    };
    $scope.HideItems = function () {

        var s = 0;
        for (var i = 0; i < $scope.Items.length; i++) {
            if ($scope.Items[i].Selected) {
                $scope.SelectItemsstr = $scope.SelectItemsstr + ',' + $scope.Items[i].text;
                s++;
            }
        }

        if (s == 0) {
            alertify.alert('Select Atleast one Item.');
        }
        else {
            $scope.SelectItems = s.toString() + ' Item/s Selected'
            $('#ItemsList').modal('hide');
        }
    };
    $scope.GetItemNames = function () {

        if (isUndefinedOrNull($scope.ItemType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetItemName';
            $scope.GETCATEParams.Condition = $scope.ItemType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {

                   if (data != '') {
                       if ($scope.oldItemType != $scope.ItemType) {
                           $scope.oldItemType = $scope.ItemType;
                           $scope.Items = [];
                           angular.forEach(data, function (value, index) {
                               $scope.Items.push({ id: value.Text, text: value.Text, Selected: false });
                           });
                       }

                   }

               })
            $('#ItemsList').modal('show');
        }
        else {
            alertify.alert('Select Item Type.');
        }

    };


    $scope.CheckBalanceQty = function (tPO) {
        if (!angular.isUndefined(tPO.Inward)) {
            var isANumber = isNaN(tPO.Inward) === false;
            if (!isANumber) {
                tPO.Inward = 0;
                alertify.alert('Please Enter Quantity only numbers');
            }
            else {
                if (parseInt(tPO.Balance) < parseInt(tPO.Inward)) {
                    tPO.Inward = 0;
                    alertify.alert('Quantity Must be less that or equal to Balance Qty');
                }
            }
        }
        else {
            tPO.Inward = null;
        }
    };
    $scope.ResetOrder = function () {

        $scope.Items = [];
        $scope.SelectItemsList = [];
        $scope.Addprds = false;
        $scope.ItemType = '';
        $scope.oldItemType = '';
        $scope.FromType = '';
        $scope.FromTypeName = '';
        $scope.txtChallanaNo = '';
        $scope.txtChallanaSNo = '';
        $scope.txtChallanaDate = '';
        $scope.txtRemarks = '';
        $scope.SelectItemsstr = '';
        $scope.SelectItems = 'Select Items';
        $scope.txtDop = '';
        $scope.DMTRNO = '';

    };

    $scope.DeleteItem = function (tPO) {


        var index = $scope.SelectItemsList.indexOf(tPO);
        $scope.SelectItemsList.splice(index, 1);
        //alert($scope.SelectItemsList.length);
        if ($scope.SelectItemsList.length >= 1) {
            $scope.Addprds = true;
            $scope.DivProducts = true;
        }
        else {
            $scope.Addprds = false;
            //$scope.DivProducts = false;  
        }
    };

    $scope.ItemsConfirm = function () {
        if ($scope.FromType != '' && $scope.txtChallanaNo != '' && $scope.FromTypeName != '' && $scope.fromdate != '') {

            if ($scope.SelectItemsList.filter(function (element) { return element.Inward < 1; }).length < 1) {
                $scope.orderloader = true;
                var Dop = new Date($scope.txtDop)
                $scope.fromdate = $filter('date')(Dop, 'MM-dd-yyyy'); //999
                var reqGetItems = {
                    method: 'POST',
                    url: "../api/Stores/Insert_Inward",
                    params: {
                        InwardNo: 0,
                        Type: $scope.FromType,
                        Designation: '',
                        Name: $scope.FromTypeName,
                        Date: '',
                        ChallanaNo: $scope.txtChallanaNo,
                        ChallanaSNo: $scope.txtChallanaSNo ? $scope.txtChallanaSNo : '',
                        ChallanaDate: $scope.fromdate,
                        RefNo: '',
                        Remarks: $scope.txtRemarks == null ? '' : $scope.txtRemarks,
                        CreatedBy: 1,
                        CreatedDate: '',
                        SessionID: sessionStorage.getItem('Sesid'),
                        DMTRNO: $scope.DMTRNO ? $scope.DMTRNO : ''
                    }
                };

                $http(reqGetItems)
                    .success(function (data) {
                        $scope.InwardNo = data[0].InwardNo;

                        if ($scope.InwardNo != '') {
                            angular.forEach($scope.SelectItemsList, function (list) {

                                var reqGetItemsList = {
                                    method: 'POST',
                                    url: "../api/Stores/Insert_Inward_Items",
                                    params: {
                                        Type: $scope.FromType,
                                        RefNo: $scope.InwardNo,
                                        ItemType: list.ItemType,
                                        ItemName: list.ItemName,
                                        Unit: list.Unit,
                                        Inward: list.Inward,
                                        Outward: 0,
                                        IsClasic: list.IsClasic,
                                        CreatedBy: '1',
                                        CreatedDate: '',
                                        ItemRemarks: list.txtRemarks == null ? '' : list.txtRemarks,
                                    }
                                };

                                $http(reqGetItemsList)
                                .success(function (result) {

                                });
                            });
                            $scope.DMTRNO_p = $scope.DMTRNO;
                            $scope.Inward_No = $scope.InwardNo;
                            $scope.InwardNo = $scope.InwardNo;
                            $scope.Type = $scope.FromType;
                            $scope.Name = $scope.FromTypeName;
                            $scope.ChallanaNo = $scope.txtChallanaNo;
                            $scope.ChallanaSNo = $scope.txtChallanaSNo;
                            $scope.ChallanaDate = $scope.fromdate;
                            $('#InwardItemsModal').modal('show');
                            $scope.InwardItems = $scope.SelectItemsList;
                            alertify.alert("Inward Created");
                            $scope.ResetOrder();
                            $scope.orderloader = false;

                        }
                        else {
                            alertify.alert('Inward not Generated Please try again');
                            $scope.orderloader = false;
                        }
                    })
                .error(function (Error) {
                    $scope.orderloader = false;
                    alertify.alert(Error.Message);
                });
            }
            else { alertify.alert('Enter Quantity for all Items'); }
        }
        else {
            alertify.alert('Select All Mandatoty Fields.');
        }
    };

    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head> <link href="css/bootstrap.min.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/styles.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/responsive.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/Validations.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/MyStyle.css" rel="stylesheet">');
        popupWin.document.write('</head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }
});

app.controller('InwardReportCtrl', function ($scope, $http, $filter, dataService) {

    //$('#myModal').modal('show');


    $scope.RptHeader = 'Inward Report';
    $scope.loader = false;
    $scope.OnRequired = false;
    $scope.fromtoRequired = false;
    $scope.Checkb = false;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');


    $scope.openondatests = function ($event) {
        $scope.ondatests.opened = true;
    };
    $scope.ondatests = {
        opened: false
    };
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

    $scope.AssignValidations = function () {
        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {
            $scope.OnRequired = true;
            $scope.fromtoRequired = false;
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
        }
        else if (rbval == 'FromTo') {
            $scope.OnRequired = false;
            $scope.fromtoRequired = true;
            $scope.txtOndate = '';
        }
        else {
            $scope.OnRequired = false;
            $scope.fromtoRequired = false;
            $scope.txtOndate = '';
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
        };
    };

    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();

    $scope.TypeRequred = function () {

        var value = $scope.Checkb;
        if (value == true) {
            $scope.isRequired = true;
        }
        else {
            $scope.isRequired = false;
        };
    };

    $scope.GetInwardReport = function () {


        var Type = '';

        if ($scope.Checkb == true) {
            if ($scope.ddlFromType != null) {
                Type = $scope.ddlFromType;
            }
            else {
                alertify.alert('Select From Type.');
                return false;
            }
        }

        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {

            if ($scope.txtOndate != null) {
                $scope.fromdate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
                $scope.todate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
                $scope.RptHeader = "Inward Report - On : " + $filter('date')($scope.txtOndate, 'dd MMM yyyy');
            }
            else {
                alertify.alert('Select Ondate.');
                return false;
            }
        }
        else if (rbval == 'FromTo') {
            if ($scope.txtFromdate != null && $scope.txtTodate != null) {
                $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
                $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
                $scope.RptHeader = "Inward Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')
            }
            else {
                alertify.alert('Select Fromdate and Todate.');
                return false;
            }
        }
        else {
            $scope.fromdate = '01/01/2015';
            var todaydate = new Date()
            $scope.todate = $filter('date')(todaydate, 'MM/dd/yyyy');
        };

        $scope.loader = true;
        $scope.InwardParams = {};
        $scope.InwardParams.action = 'Inwards';
        $scope.InwardParams.fromdate = $scope.fromdate;
        $scope.InwardParams.todate = $scope.todate;
        $scope.InwardParams.Type = Type.toString();

        var reqInwardReport = {
            method: 'POST',
            url: "../api/Stores/InwardReport",
            data: { Info: EncriptInfo(JSON.stringify($scope.InwardParams)) }
        };
        $http(reqInwardReport)
         .success(function (Response) {
             $('#myModal').modal('hide');
             $scope.InwardRpt = Response;
             $scope.loader = false;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };

    $scope.GetInwardReport();

    $scope.GetInwardItemsByInwardID = function (data) {

        $scope.Inward_No = data.InwardNo;
        $scope.InwardNo = data.InwardNo;
        $scope.Type = data.Type;
        $scope.Name = data.Name;
        $scope.ChallanaNo = data.ChallanaNo;
        $scope.ChallanaSNo = data.ChallanaSNo;
        $scope.ChallanaDate = data.ChallanaDate;
        $scope.DMTRNO_p = data.DMTRNO;

        var reqInwardReport = {
            method: 'GET',
            url: "../api/Stores/GetItemsByID",
            params: { Action: 'Inward', ID: data.InwardNo }
        };
        $http(reqInwardReport)
         .success(function (Response) {
             $('#InwardItemsModal').modal('show');
             $scope.InwardItems = Response;
             $scope.loader = false;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    }





    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.InwardRpt, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                InwardNo: item.InwardNo,
                Type: item.Type,
                Name: item.Name,
                ChallanaNo: item.ChallanaNo,
                ChallanaSNo: item.ChallanaSNo,
                ChallanaDate: item.ChallanaDate

            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Inward-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head> <link href="css/bootstrap.min.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/styles.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/responsive.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/Validations.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/MyStyle.css" rel="stylesheet">');
        popupWin.document.write('</head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }

    $scope.InwardAdd = function () {
        window.location.href = "#/Inward";
    }

});

//////////////////////////// End Inward ///////////////////////////////////


///////////////////////////// Outward ///////////////////////////////////
app.controller('OutwardCtrl', function ($scope, $http, $filter, dataService) {

    $scope.disunit = true;
    $scope.dispprds = true;
    $scope.regid = 0;
    $scope.DivProducts = true;
    $scope.ClasicBal = "0";
    $scope.NonClasicBal = "0";
    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();
    $scope.IsClasic = "Class A";
    $scope.SelectItems = 'Select Items';
    $scope.ItemRemarks = '';
    $scope.SelectItemsstr = '';
    $('#InwardItemsModal').modal('hide');
    $scope.GetFromTypeNames = function () {

        $scope.FromTypeName = "";
        if (isUndefinedOrNull($scope.FromType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetFromTypeNames';
            $scope.GETCATEParams.Condition = $scope.FromType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.FromTypeNames = data
               })
        }
        else {
            $scope.FromTypeName = "";
        }
    };

    $scope.LoadItemTypes = function () {
        $scope.Type = "";
        $scope.ItemType = '';
        $scope.ItemName = "";

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'ItemTypes';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.ItemTypes = data;
               }
               else {
                   $scope.ItemType = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadItemTypes();
    $scope.GetItemNames = function () {
        $scope.ItemName = "";
        if (isUndefinedOrNull($scope.ItemType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetItemName';
            $scope.GETCATEParams.Condition = $scope.ItemType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.ItemNames = data
               })
        }
        else {
            $scope.ItemName = "";
        }
    };

    $scope.LoadUnits = function () {
        $scope.Unit = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetUnits';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Units = data;
               }
               else {
                   $scope.Unit = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadUnits();


    $scope.DoD = function ($event) {
        $scope.ODOD.opened = true;
    };

    $scope.ODOD = {
        opened: false
    };

    $scope.GetItemBalanceNUnit = function () {
        var reqCat = {
            method: 'GET',
            url: "../api/Stores/GetItemBalanceNUnit",
            params: { ItemType: $scope.ItemType, ItemName: $scope.ItemName, IsClasic: '' }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.ItemBalanceNUnits = data;
                   $scope.UnitName = $scope.ItemBalanceNUnits[0].UnitName;
                   $scope.ClasicBal = $scope.ItemBalanceNUnits[0].ClasicBal;
                   $scope.NonClasicBal = $scope.ItemBalanceNUnits[0].NonClasicBal;

                   $scope.hasSLNo = $scope.ItemBalanceNUnits[0].hasSLNo;

               }
               else {
                   $scope.ItemBalanceNUnits = "";
                   $scope.UnitName = "";
                   $scope.ClasicBal = "0";
                   $scope.NonClasicBal = "0";
               }
           })
        .error(function (data, status, headers, config) {
        });
    };


    $scope.CheckBalanceQty = function (tPO) {
        
        
        if (!angular.isUndefined(tPO.Inward)) {
            
            var isANumber = isNaN(tPO.Inward) === false;
            
            if (!isANumber) {
                tPO.Inward = 0;
                alertify.alert('Please Enter Quantity only numbers');
            }
            else
            {
                if (parseInt(tPO.Balance) < parseInt(tPO.Inward)) {
                    tPO.Inward = 0;
                    alertify.alert('Quantity Must be less that or equal to Balance Qty');
                }
            }
        }
        else
        {
            tPO.Inward = null;
        }
    };

    $scope.SelectItemsList = [];
    $scope.AddItems = function () {
        $scope.addprdloader = true;
        if ($scope.ItemType != '' && $scope.IsClasic != '' && $scope.SelectItemsstr) {
            $scope.SelectItemsstr = $scope.SelectItemsstr + ":" + $scope.ItemType + "," + $scope.IsClasic + "," + $scope.ItemRemarks + '|';
            var reqCat = {
                method: 'GET',
                url: "../api/Stores/AddItemToGrid",
                params: { SelectedItems: $scope.SelectItemsstr }
            };
            $http(reqCat)
               .success(function (data) {

                   if (data != "") {

                       $scope.SelectItemsstr = $scope.SelectItemsstr;
                       $scope.SelectItemsList = data;
                       $scope.Addprds = true;
                       $scope.DivProducts = true;
                       $scope.ItemType = '';
                       $scope.IsClasic = 'Class A';
                       $scope.ItemRemarks = '';
                       $scope.addprdloader = false;
                       $scope.SelectItems = 'Select Items';
                       $scope.oldItemType = '';
                       $scope.Items = [];
                   }
                   else {
                       $scope.SelectItemsList = [];
                   }
               })
            .error(function (data, status, headers, config) {
            });
        }
        else {
            alertify.alert('Select All Mandatoty Fields.');
            $scope.addprdloader = false;
        }
        $scope.addprdloader = false;
    };
    $scope.HideItems = function () {

        var s = 0;
        for (var i = 0; i < $scope.Items.length; i++) {
            if ($scope.Items[i].Selected) {
                $scope.SelectItemsstr = $scope.SelectItemsstr + ',' + $scope.Items[i].text;
                s++;
            }
        }

        if (s == 0) {
            alertify.alert('Select Atleast one Item.');
        }
        else {
            $scope.SelectItems = s.toString() + ' Item/s Selected'
            $('#ItemsList').modal('hide');
        }
    };
    $scope.GetItemNames = function () {

        if (isUndefinedOrNull($scope.ItemType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetItemName';
            $scope.GETCATEParams.Condition = $scope.ItemType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {

                   if (data != '') {
                       if ($scope.oldItemType != $scope.ItemType) {
                           $scope.oldItemType = $scope.ItemType;
                           $scope.Items = [];
                           angular.forEach(data, function (value, index) {
                               $scope.Items.push({ id: value.Text, text: value.Text, Selected: false });
                           });
                       }

                   }

               })
            $('#ItemsList').modal('show');
        }
        else {
            alertify.alert('Select Item Type.');
        }

    };

    $scope.ResetOrder = function () {

        $scope.Items = [];
        $scope.SelectItemsList = [];
        $scope.Addprds = false;
        $scope.ItemType = '';
        $scope.oldItemType = '';
        $scope.FromType = '';
        $scope.FromTypeName = '';
        $scope.txtChallanaNo = '';
        $scope.txtChallanaSNo = '';
        $scope.txtChallanaDate = '';
        $scope.txtRemarks = '';
        $scope.SelectItemsstr = '';
        $scope.SelectItems = 'Select Items';
        $scope.txtDop = '';

    };

    $scope.DeleteItem = function (tPO) {


        var index = $scope.SelectItemsList.indexOf(tPO);
        $scope.SelectItemsList.splice(index, 1);
        alert($scope.SelectItemsList.length);
        if ($scope.SelectItemsList.length >= 1) {
            $scope.Addprds = true;
            $scope.DivProducts = true;
        }
        else {
            $scope.Addprds = false;
            //$scope.DivProducts = false;  
        }
    };

    $scope.ItemsConfirm = function () {
        $scope.addprdloader = true;
        if ($scope.FromType != '' && $scope.txtChallanaNo != '' && $scope.FromTypeName != '' && $scope.fromdate != '') {

            if ($scope.SelectItemsList.filter(function (element) { return element.Inward < 1; }).length < 1) {
                $scope.orderloader = true;
                var Dop = new Date($scope.txtDop)
                $scope.fromdate = $filter('date')(Dop, 'MM-dd-yyyy'); //999

                var reqGetItems = {
                    method: 'POST',
                    url: "../api/Stores/Insert_Outward",
                    params: {
                        OutwardNo: 0,
                        Type: $scope.FromType,
                        Designation: '',
                        Name: $scope.FromTypeName,
                        Date: '',
                        ChallanaNo: $scope.txtChallanaNo,
                        ChallanaSNo: $scope.txtChallanaSNo ? $scope.txtChallanaSNo : '',
                        ChallanaDate: $scope.fromdate,
                        RefNo: '',
                        Remarks: $scope.txtRemarks == null ? '' : $scope.txtRemarks,
                        CreatedBy: 1,
                        CreatedDate: '',
                        SessionID: sessionStorage.getItem('Sesid')
                    }
                };

                $http(reqGetItems)
                    .success(function (data) {
                        $scope.OutwardNo = data[0].OutwardNo;
                        if ($scope.OutwardNo != '') {
                            angular.forEach($scope.SelectItemsList, function (list) {

                                var reqGetItemsList = {
                                    method: 'POST',
                                    url: "../api/Stores/Insert_Outward_Items",
                                    params: {
                                        Type: $scope.FromType,
                                        RefNo: $scope.OutwardNo,
                                        ItemType: list.ItemType,
                                        ItemName: list.ItemName,
                                        Unit: list.Unit,
                                        Inward: 0,
                                        Outward: list.Inward,
                                        IsClasic: list.IsClasic,
                                        CreatedBy: '1',
                                        CreatedDate: '',
                                        ItemRemarks: list.ItemRemarks ? list.ItemRemarks : ''
                                    }
                                };
                                $http(reqGetItemsList)
                                .success(function (result) {

                                });
                            });

                            $scope.Inward_No = $scope.OutwardNo;
                            $scope.InwardNo = $scope.OutwardNo;
                            $scope.Type = $scope.FromType;
                            $scope.Name = $scope.FromTypeName;
                            $scope.ChallanaNo = $scope.txtChallanaNo;
                            $scope.ChallanaSNo = $scope.txtChallanaSNo;
                            $scope.ChallanaDate = $scope.fromdate;
                            $('#InwardItemsModal').modal('show');
                            $scope.InwardItems = $scope.SelectItemsList;
                            $scope.addprdloader = false;
                            alertify.alert("Outward Created");
                            $scope.ResetOrder();

                        }
                        else {
                            alertify.alert('Outward not Generated Please try again');
                            $scope.orderloader = false;
                        }
                    })
                .error(function (Error) {
                    $scope.orderloader = false;
                    alertify.alert(Error.Message);
                });
            }
            else { alertify.alert('Enter Quantity for all Items'); $scope.addprdloader = false; }
        }
        else {
            alertify.alert('Select All Mandatoty Fields.');
            $scope.addprdloader = false;
        }
    };

    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head> <link href="css/bootstrap.min.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/styles.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/responsive.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/Validations.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/MyStyle.css" rel="stylesheet">');
        popupWin.document.write('</head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }
});

app.controller('OutwardReportCtrl', function ($scope, $http, $filter, dataService) {

    //  $('#myModal').modal('show');
    $scope.RptHeader = 'Outward Report';
    $scope.loader = false;
    $scope.OnRequired = false;
    $scope.fromtoRequired = false;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.fromtoRequired = true;

    $scope.openondatests = function ($event) {
        $scope.ondatests.opened = true;
    };
    $scope.ondatests = {
        opened: false
    };
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

    $scope.AssignValidations = function () {
        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {
            $scope.OnRequired = true;
            $scope.fromtoRequired = false;
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
        }
        else if (rbval == 'FromTo') {
            $scope.OnRequired = false;
            $scope.fromtoRequired = true;
            $scope.txtOndate = '';
        }
        else {
            $scope.OnRequired = false;
            $scope.fromtoRequired = false;
            $scope.txtOndate = '';
            $scope.txtFromdate = '';
            $scope.txtTodate = '';
        };
    };

    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();

    $scope.TypeRequred = function () {

        var value = $scope.Checkb;
        if (value == true) {
            $scope.isRequired = true;
        }
        else {
            $scope.isRequired = false;
        };
    };

    $scope.GetOutwardReport = function () {



        var Type = '';
        if ($scope.Checkb == true) {
            if ($scope.ddlFromType != null) {
                Type = $scope.ddlFromType;
            }
            else {
                alertify.alert('Select From Type.');
                return false;
            }
        }


        var rbval = $("input:radio[name='rbcontent']:checked").val()
        if (rbval == 'rbon') {
            if ($scope.txtOndate != null) {
                $scope.fromdate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
                $scope.todate = $filter('date')($scope.txtOndate, 'MM/dd/yyyy');
                $scope.RptHeader = "Outward Report - On : " + $filter('date')($scope.txtOndate, 'dd MMM yyyy');
            }
            else {
                alertify.alert('Select Ondate.');
                return false;
            }
        }
        else if (rbval == 'FromTo') {
            if ($scope.txtFromdate != null && $scope.txtTodate != null) {
                $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
                $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
                $scope.RptHeader = "Outward Report - Between " + $filter('date')($scope.txtFromdate, 'dd MMM yyyy') + ' and ' + $filter('date')($scope.txtTodate, 'dd MMM yyyy')
            }
            else {
                alertify.alert('Select Fromdate and Todate.');
                return false;
            }
        }
        else {
            $scope.fromdate = '01/01/2015';
            var todaydate = new Date()
            $scope.todate = $filter('date')(todaydate, 'MM/dd/yyyy');
        };

        $scope.loader = true;
        $scope.OutwardParams = {};
        $scope.OutwardParams.action = 'Outwards';
        $scope.OutwardParams.fromdate = $scope.fromdate;
        $scope.OutwardParams.todate = $scope.todate;
        $scope.OutwardParams.Type = Type.toString();

        var reqOutwardReport = {
            method: 'POST',
            url: "../api/Stores/OutwardReport",
            data: { Info: EncriptInfo(JSON.stringify($scope.OutwardParams)) }
        };
        $http(reqOutwardReport)
         .success(function (Response) {
             $('#myModal').modal('hide');
             $scope.OutwardRpt = Response;
             if (isUndefinedOrNull(dataService.Add) != '') {
                 $scope.GetItemsByID($scope.OutwardRpt[0]);
                 dataService.Add = '';
             }
             $scope.loader = false;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };

    $scope.GetOutwardReport();
    $scope.GetItemsByID = function (data) {

        $scope.OutwardNo = data.OutwardNo;
        $scope.InwardNo = data.OutwardNo;
        $scope.Type = data.Type;
        $scope.Name = data.Name;
        $scope.ChallanaNo = data.ChallanaNo;
        $scope.ChallanaSNo = data.ChallanaSNo;
        $scope.ChallanaDate = data.ChallanaDate;

        var reqInwardReport = {
            method: 'GET',
            url: "../api/Stores/GetItemsByID",
            params: { Action: 'Outward', ID: data.OutwardNo }
        };

        $http(reqInwardReport)
         .success(function (Response) {
             $('#InwardItemsModal').modal('show');
             $scope.InwardItems = Response;
             $scope.loader = false;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    }
    $scope.exportToExcel = function () {

        $scope.TempOutwardRpt = [];
        var sno = 1;
        angular.forEach($scope.OutwardRpt, function (item) {
            $scope.TempOutwardRpt.push({
                Sno: sno,//item.$id,
                OutwardNo: item.OutwardNo,
                Type: item.Type,

                Name: item.Name,
                ChallanaNo: item.ChallanaNo,
                ChallanaSNo: item.ChallanaSNo,
                ChallanaDate: item.ChallanaDate

            });
            sno = sno + 1;
        });
        if ($scope.TempOutwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempOutwardRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Outward-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head> <link href="css/bootstrap.min.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/styles.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/responsive.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/Validations.css" rel="stylesheet">');
        popupWin.document.write('<link href="css/MyStyle.css" rel="stylesheet">');
        popupWin.document.write('</head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    }


    $scope.OutwardAdd = function () {
        window.location.href = "#/Outward";
    }
});
//////////////////////////// End Outward ///////////////////////////////////


//////////////////////////// Balance Report ///////////////////////////////////
app.controller('BalanceoldReportCtrl', function ($scope, $http, $filter) {
    $scope.RptHeader = 'Balance Report';
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.GetInwardReport = function () {

        var reqInwardReport = {
            method: 'POST',
            url: "../api/Stores/BalanceReport",
            params: { Fromdate: '01/01/2015', Todate: '01/01/2018' }
        };
        $http(reqInwardReport)
         .success(function (Response) {
             $scope.ItemBalances = Response;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };
    $scope.GetInwardReport();
    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.ItemBalances, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                ItemType: item.ItemType,
                ItemName: item.ItemName,
                Unit: item.Unit,
                IsClasic: item.IsClasic,
                Inward: item.Inward,
                Outward: item.Outward,
                Balance: item.Balance

            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Balance-Report-" + GetCurrDate() + ".xls");
        };
    };
});

app.controller('BalanceReportCtrl', function ($scope, $http, $filter) {
    $scope.RptHeader = 'Balance Report';
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.SelectItems = 'Select Item Types';
    $scope.ItemGroup_ = 'All';

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


    $scope.LoadItemTypes = function () {
        $scope.roles = [];
        $scope.Type = "";
        $scope.ItemType = '';
        $scope.ItemName = "";

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'ItemTypes';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.Items = [];
                   angular.forEach(data, function (value, index) {
                       $scope.Items.push({ id: value.Text, text: value.Text, Selected: true });
                   });
                   $('#ItemsList').modal('show');
               }
               else {
                   $scope.Items = [];
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    //$scope.LoadItemTypes();

    $scope.HideItems = function () {

        var s = 0;
        for (var i = 0; i < $scope.Items.length; i++) {
            if ($scope.Items[i].Selected) {
                $scope.ItemGroup_ = $scope.ItemGroup_ + ',' + $scope.Items[i].text;
                s++;
            }
        }

        if (s == 0) {
            alertify.alert('Select Atleast one Item.');
        }
        else {
            $scope.SelectItems = s.toString() + ' Item/s Selected'
            $('#ItemsList').modal('hide');
        }
    };

    $scope.GetInwardReport = function () {

        $scope.fromdate1 = $filter('date')($scope.txtFromdate, 'MM-dd-yyyy');
        $scope.todate1 = $filter('date')($scope.txtTodate, 'MM-dd-yyyy');
        $scope.mydate = new Date($scope.txtFromdate);
        if ($scope.txtFromdate == 'undefined' || $scope.txtFromdate == null) {

            var currentTime = new Date();
            var last = new Date();
            var lastmonth = last.setMonth(last.getMonth() - 1);

            $scope.fromdate2 = $filter('date')(lastmonth, 'dd MMM yyyy');
            $scope.todate2 = $filter('date')(currentTime, 'dd MMM yyyy');

        }
        else {
            $scope.fromdate2 = $filter('date')($scope.txtFromdate, 'dd MMM yyyy');
            $scope.todate2 = $filter('date')($scope.txtTodate, 'dd MMM yyyy');
        }

        $scope.RptHeader = "Balance Report - Between " + $scope.fromdate2 + ' and ' + $scope.todate2;


        
        

        var reqInwardReport = {
            method: 'POST',
            url: "../api/Stores/MonthWiseBalanceReport",
            params: { fromdate: $scope.fromdate1 ? $scope.fromdate1 : '', todate: $scope.todate1 ? $scope.todate1 : '', ItemGroup:$scope.ItemGroup_ }
        };
        $http(reqInwardReport)
         .success(function (Response) {
             $scope.ItemBalances = Response;
             $scope.ItemGroup_ = '';

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });
    };
    $scope.GetInwardReport();
    $scope.GetOutwardItemsByFromType = function (ItemType, ItemName, Type) {

        $scope.ItemType = ItemType;
        $scope.ItemName = ItemName;
        $scope.Type = Type;

        var reqInwardReport = {
            method: 'GET',
            url: "../api/Stores/GetOutwardItemsByFromType",
            params: { Action: Type, ItemType: ItemType, ItemName: ItemName, FromDate: $scope.fromdate ? $scope.fromdate : '', Todate: $scope.todate ? $scope.todate : '' }
        };

        $http(reqInwardReport)
         .success(function (Response) {
             $('#InwardItemsModal').modal('show');
             $scope.InwardItems = Response;
             $scope.loader = false;

         })
        .error(function (Message) {
            $scope.loader = false;
            alertify.alert(Message.Message);
        });

    };

    $scope.exportToExcel = function () {

        $scope.TempInwardRpt = [];
        var sno = 1;
        angular.forEach($scope.ItemBalances, function (item) {
            $scope.TempInwardRpt.push({
                Sno: sno,//item.$id,
                ItemType: item.ItemType,
                ItemName: item.ItemName,
                Unit: item.Unit,
                IsClasic: item.IsClasic,
                Inward: item.Inward,
                Outward: item.Outward,
                Balance: item.Balance

            });
            sno = sno + 1;
        });
        if ($scope.TempInwardRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempInwardRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Balance-Report-" + GetCurrDate() + ".xls");
        };
    };
    $scope.printDiv = function (divName) {

        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=500,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head> <link href="../Styles/bootstrap.min.css" rel="stylesheet">');
        popupWin.document.write('<link href="../Styles/style.css" rel="stylesheet">');
        popupWin.document.write('<link href="../css/responsive.css" rel="stylesheet">');
        popupWin.document.write('<link href="../css/Validations.css" rel="stylesheet">');
        popupWin.document.write('<link href="../css/MyStyle.css" rel="stylesheet">');
        popupWin.document.write('</head><body onload="window.print()">' + document.getElementById(divName).innerHTML + '</body></html>');
        popupWin.document.close();
    }

    $scope.RomanNum = function (value) {
        var roman = new Array();
        roman = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
        var decimal = new Array();
        decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        function decimalToRomanSimple(value) {
            if (value <= 0 || value >= 4000) return value;
            var romanNumeral = "";
            for (var i = 0; i < roman.length; i++) {
                while (value >= decimal[i]) {
                    value -= decimal[i];
                    romanNumeral += roman[i];
                }
            }
            return romanNumeral;
        }
    };
});

app.controller('SupplyReportCtrl', function ($scope, $http, $filter, dataService) {

    $scope.RptHeader = 'Supply Statement Report';
    $scope.loader = false;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.fromtoRequired = true;
    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');

    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();

    $scope.GetFromTypeNames = function () {

        $scope.FromTypeName = "";
        if (isUndefinedOrNull($scope.FromType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetFromTypeNames';
            $scope.GETCATEParams.Condition = $scope.FromType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.FromTypeNames = data
               })
        }
        else {
            $scope.FromTypeName = "";
        }
    };



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

    $scope.GetSupplyReport = function () {

        if ($scope.Project != '' && $scope.UCC != '') {
            $scope.loader = true;

            $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
            $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
            $scope.RptHeader = "Supply Statement Report -Mode : " + $scope.FromType + "; Name : " + $scope.FromTypeName;


            $scope.Params = {};
            $scope.Params.fromdate = '01/01/2015';
            $scope.Params.todate = '01/01/2025';
            $scope.Params.Mode = $scope.FromType;
            $scope.Params.Name = $scope.FromTypeName;
            $scope.Params.BranchID = sessionStorage.getItem("BranchID");

            var reqInwardReport = {
                method: 'POST',
                url: "../api/Stores/SupplyReport",
                data: { Info: EncriptInfo(JSON.stringify($scope.Params)) }
            };
            $http(reqInwardReport)
             .success(function (Response) {

                 $scope.SupplyReport = Response;


                 $scope.loader = false;

             })
            .error(function (Message) {
                $scope.loader = false;
                alertify.alert(Message.Message);
            });
        }
        else {
            alertify.alert('Select Mode of Transaction and Name');
        }
    };

    //   $scope.GetSuplyReport();

    $scope.exportToExcel = function () {

        $scope.TempRpt = [];
        var sno = 1;
        angular.forEach($scope.SupplyReport, function (item) {
            $scope.TempRpt.push({
                Sno: sno,//item.$id,
                ReceiptNo: item.ReceiptNo,
                ReceiptDate: item.ReceiptDate,
                ItemType: item.ItemType,
                ItemName: item.ItemName,
                Unit: item.Unit,
                Qty: item.Qty

            });
            sno = sno + 1;
        });
        if ($scope.TempRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Supply-Statement-Report-" + GetCurrDate() + ".xls");
        };
    };


});

app.controller('MaterialReportCtrl', function ($scope, $http, $filter, dataService) {

    $scope.RptHeader = 'Material Statement Report';
    $scope.loader = false;

    $scope.OnRequired = false;
    $scope.fromtoRequired = false;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.fromtoRequired = true;
    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');

    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();

    $scope.GetFromTypeNames = function () {

        $scope.FromTypeName = "";
        if (isUndefinedOrNull($scope.FromType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetFromTypeNames';
            $scope.GETCATEParams.Condition = $scope.FromType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.FromTypeNames = data
               })
        }
        else {
            $scope.FromTypeName = "";
        }
    };


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

    $scope.GetMaterialReport = function () {

        if ($scope.Project != '' && $scope.UCC != '') {
            $scope.loader = true;

            $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
            $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
            $scope.RptHeader = "Material Statement Report -Mode : " + $scope.FromType + "; Name : " + $scope.FromTypeName;


            $scope.Params = {};
            $scope.Params.fromdate = '01/01/2015';
            $scope.Params.todate = '01/01/2025';
            $scope.Params.Mode = $scope.FromType;
            $scope.Params.Name = $scope.FromTypeName;
            $scope.Params.BranchID = sessionStorage.getItem("BranchID");

            var reqInwardReport = {
                method: 'POST',
                url: "../api/Stores/MaterialReport",
                data: { Info: EncriptInfo(JSON.stringify($scope.Params)) }
            };
            $http(reqInwardReport)
             .success(function (Response) {

                 $scope.MaterialReport = Response;


                 $scope.loader = false;

             })
            .error(function (Message) {
                $scope.loader = false;
                alertify.alert(Message.Message);
            });
        }
        else {
            alertify.alert('Select Mode of Transaction and Name');
        }
    };

    //   $scope.GetSuplyReport();

    $scope.exportToExcel = function () {

        $scope.TempRpt = [];
        var sno = 1;
        var old = 0;
        angular.forEach($scope.MaterialReport, function (item) {

            if (item.Unit != 'Total') {
                var ItemName = '';
                if (item.ItemRank == '1') {
                    old = sno;
                    ItemName = item.ItemName;
                }
                else { old = '';
                ItemName = '';}

                $scope.TempRpt.push({
                    'S.No': old,//item.$id,
                    'Description of Material': ItemName,
                    'Challana No. and Date': item.ReceiptDate ? item.ReceiptDate : '',
                    'Unit': item.Unit,
                    'Qty Issued': item.QtyIssued ? item.QtyIssued : '',
                    'Qty Used': '',
                    'Qty Available at Site': '',
                    'Qty Returned to Store': item.QtyReturned ? item.QtyReturned : '',
                    'DMTR Particulars': item.DMTRNo ? item.DMTRNo : ''
                });
                
            }
            else {
                var qtysite = item.QtyIssued - item.QtyUsed;
                $scope.TempRpt.push({
                    'S.No': '',//item.$id,
                    'Description of Material': '',
                    'Challana No. and Date': '',
                    'Unit': item.Unit,
                    'Qty Issued': item.QtyIssued ? item.QtyIssued : '',
                    'Qty Used': item.QtyUsed ? item.QtyUsed : '',
                    'Qty Available at Site': qtysite ? qtysite : '',
                    'Qty Returned to Store': item.QtyReturned ? item.QtyReturned : '',
                    'DMTR Particulars': ''

                });
                $scope.TempRpt.push({
                    'S.No': '',//item.$id,
                    'Description of Material': '',
                    'Challana No. and Date': '',
                    'Unit': '',
                    'Qty Issued':  '',
                    'Qty Used':  '',
                    'Qty Available at Site':  '',
                    'Qty Returned to Store':  '',
                    'DMTR Particulars': ''

                });
                sno = sno + 1;
            }
        });
        if ($scope.TempRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Material-Statement-Report-" + GetCurrDate() + ".xls");
        };
    };

    $scope.printDiv = function (divName) {
        $scope.MaterialReport_Print = $scope.MaterialReport;
        $('#PrintReport').modal('show');
    };
});

app.controller('ReturnReportCtrl', function ($scope, $http, $filter, dataService) {

    $scope.RptHeader = 'Return To Store Report';
    $scope.loader = false;
    $scope.ItemsperPage = 10;
    $scope.currentPage = 1;
    $scope.fromtoRequired = true;
    $scope.minDate = '01/01/2015';
    var maxdate = new Date()
    $scope.maxDate = $filter('date')(maxdate, 'MM/dd/yyyy');
    $scope.frommaxDate = $filter('date')(maxdate, 'MM/dd/yyyy');

    $scope.LoadFromTypes = function () {
        $scope.FromType = '';

        $scope.GETCATEParams = {};
        $scope.GETCATEParams.Action = 'GetFromType';
        $scope.GETCATEParams.Condition = '';
        $scope.GETCATEParams.ItemID = 0;

        var reqCat = {
            method: 'POST',
            url: "../api/Common/Dropdown",
            data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
        };
        $http(reqCat)
           .success(function (data) {
               if (data != "") {
                   $scope.FromTypes = data;
               }
               else {
                   $scope.FromTypes = "";
               }
           })
        .error(function (data, status, headers, config) {
        });

    }
    $scope.LoadFromTypes();

    $scope.GetFromTypeNames = function () {

        $scope.FromTypeName = "";
        if (isUndefinedOrNull($scope.FromType) != "") {
            $scope.GETCATEParams = {};
            $scope.GETCATEParams.Action = 'GetFromTypeNames';
            $scope.GETCATEParams.Condition = $scope.FromType;
            $scope.GETCATEParams.ItemID = 0;

            var reqSubCategory = {
                method: 'POST',
                url: "../api/Common/Dropdown",
                data: { Info: EncriptInfo(JSON.stringify($scope.GETCATEParams)) }
            };
            $http(reqSubCategory)
               .success(function (data) {
                   $scope.FromTypeNames = data
               })
        }
        else {
            $scope.FromTypeName = "";
        }
    };



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

    $scope.GetSupplyReport = function () {

        if ($scope.Project != '' && $scope.UCC != '') {
            $scope.loader = true;

            $scope.fromdate = $filter('date')($scope.txtFromdate, 'MM/dd/yyyy');
            $scope.todate = $filter('date')($scope.txtTodate, 'MM/dd/yyyy');
            $scope.RptHeader = "Return To Store Report -Mode : " + $scope.FromType + "; Name : " + $scope.FromTypeName;


            $scope.Params = {};
            $scope.Params.fromdate = '01/01/2015';
            $scope.Params.todate = '01/01/2025';
            $scope.Params.Mode = $scope.FromType;
            $scope.Params.Name = $scope.FromTypeName;
            $scope.Params.BranchID = sessionStorage.getItem("BranchID");

            var reqInwardReport = {
                method: 'POST',
                url: "../api/Stores/ReturnReport",
                data: { Info: EncriptInfo(JSON.stringify($scope.Params)) }
            };
            $http(reqInwardReport)
             .success(function (Response) {

                 $scope.SupplyReport = Response;


                 $scope.loader = false;

             })
            .error(function (Message) {
                $scope.loader = false;
                alertify.alert(Message.Message);
            });
        }
        else {
            alertify.alert('Select Mode of Transaction and Name');
        }
    };

    //   $scope.GetSuplyReport();

    $scope.exportToExcel = function () {

        $scope.TempRpt = [];
        var sno = 1;
        angular.forEach($scope.SupplyReport, function (item) {
            $scope.TempRpt.push({
                Sno: sno,//item.$id,
                ReceiptNo: item.ReceiptNo,
                ReceiptDate: item.ReceiptDate,
                ItemType: item.ItemType,
                ItemName: item.ItemName,
                Unit: item.Unit,
                Qty: item.Qty

            });
            sno = sno + 1;
        });
        if ($scope.TempRpt.length > 0) {

            var data = CreateTableView_Excel($scope.TempRpt, $scope.RptHeader);
            var blob = new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            saveAs(blob, "Supply-Statement-Report-" + GetCurrDate() + ".xls");
        };
    };


});

//////////////////////////// End Balance Report ///////////////////////////////////


