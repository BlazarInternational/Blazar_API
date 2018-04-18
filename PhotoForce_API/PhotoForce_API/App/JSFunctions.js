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
    var targeturl = "http://www.smartsoft.in/ssfeedback.asp?from=www.Addshop.co"
    newwin = window.open("", "", "scrollbars=no | resizable=no")
    if (document.all) {
        newwin.moveTo((screen.width - 680) / 2, (screen.height - 500) / 2)
        newwin.resizeTo(680, 500)

    }
    newwin.location = targeturl
}
function CreateTableView(objArray, theme, enableHeader) {
    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;

    var str = '<table style="border:1px solid #ddd;background-color:transparent;Height:50px;">';

    // table head
    if (enableHeader) {
        str += '<thead><tr>';
        for (var index in array[0]) {
            str += '<th style="border:1px solid #c6c6c6;background-color:#ddd;padding:10px;line-height:2;" scope="col">' + index + '</th>';
        }
        str += '</tr></thead>';
    }
    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        str += '<tr>';
        for (var idx in array[i]) {
            if ((i % 2 === 0))
                str += '<td style="mso-number-format:\@;border:1px solid #ddd;background-color:#fbfbfb;padding:8px;line-height:1.42857143;border-top:1px solid #ddd;text-align:center;"> ' + array[i][idx] + '</td>';
            else
                str += '<td style="mso-number-format:\@;border:1px solid #ddd;padding:8px;line-height:1.42857143;border-top:1px solid #ddd;text-align:center;"> ' + array[i][idx] + '</td>';
        }
        str += '</tr>';
    }
    str += '</tbody>';
    str += '</table>';
    return str;
}
function isUndefinedOrNull(val) {

    if (angular.isUndefined(val) || val === null || val === undefined)
        return '';
    else
        return val;
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 40; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function makenumericid(size) {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function makeUniqId(max) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
 
function MM_preloadImages() { //v3.0
    var d = document; if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length, a = MM_preloadImages.arguments; for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") != 0) { d.MM_p[j] = new Image; d.MM_p[j++].src = a[i]; }
    }
}
function getCurrentFiscalYear() {
    //get current date
    var today = new Date();

    //get current month
    var curMonth = today.getMonth();

    var fiscalYr = "";
    if (curMonth > 3) { //
        var nextYr1 = (today.getFullYear() + 1).toString();
        fiscalYr = today.getFullYear().toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
    } else {
        var nextYr2 = today.getFullYear().toString();
        fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
    }
}
var Currentqtr = getCurrentFiscalYear();
function GetCurrDate() {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + ''
        + (currentdate.getMonth() + 1) + ''
        + currentdate.getFullYear() + ''
        + currentdate.getHours() + ''
        + currentdate.getMinutes() + ''
        + currentdate.getSeconds();
    return datetime;
};
function CreateTableView_Excel(objArray, Header) {
    // If the returned data is an object do nothing, else try to parse
    var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;

    var colspan = 0;
    for (var idx in array[0]) {
        colspan = colspan + 1;
    }

    var str = '<table style="border:1px solid #ddd;background-color:transparent;Height:50px;">';

    // Report Header 
    str += '<thead><tr>';
    str += '<th style="border:1px solid #c6c6c6;background-color:#ddd;padding:10px;line-height:2;" scope="col" colspan=' + colspan + '>' + Header + '</th>';
    str += '</tr></thead>';

    // table head    
    str += '<thead><tr>';
    for (var index in array[0]) {
        str += '<th scope="col" style="border:1px normal #c6c6c6;background-color:#ddd;padding:5px;line-height:1.5;">' + index + '</th>';
    }
    str += '</tr></thead>';

    // table body
    str += '<tbody>';
    for (var i = 0; i < array.length; i++) {
        str += '<tr>';
        for (var idx in array[i]) {
            if ((i % 2 === 0))
                str += '<td style="mso-number-format:0;border:1px solid #ddd;background-color:#fbfbfb;padding:8px;line-height:1.42857143;border-top:1px solid #ddd;text-align:center;"> ' + array[i][idx] + '</td>';
            else
                str += '<td style="mso-number-format:0;border:1px solid #ddd;padding:8px;line-height:1.42857143;border-top:1px solid #ddd;text-align:center;"> ' + array[i][idx] + '</td>';
        }
        str += '</tr>';
    }
    str += '</tbody>';
    str += '</table>';

    return str;
}     
function makeRegpwds(max) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < max; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
 