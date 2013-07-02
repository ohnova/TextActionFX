var ActionCheckTimer;
var EnableSuggestionButtons = true;
var element;

$(document).ready(function() {
    // element' HTML value initialization.
    // $(".setting").hide();
    
    $("#outputbox").val(""); 
    if(TextAction.SettingValueLanguage == TextAction.indexAll) {
       $("#language_button").html("ALL");
    }
    
    $("#delete_button").click(function() {
        var str = $("#outputbox").val();
        $("#outputbox").val(str.substring(0, str.length - 1));
    });
    
    $("#clear_button").click(function() {
        $("#outputbox").val("");
        $("#suggestion_buttons").hide();
    });
    
    $("#language_button").click(function() {
        if(TextAction.SettingValueLanguage == TextAction.indexAll){
            TextAction.SettingValueLanguage = TextAction.indexEng;
            $("#language_button").html("ENG");
        } 
        else if(TextAction.SettingValueLanguage == TextAction.indexEng){
            TextAction.SettingValueLanguage = TextAction.indexNum;
            $("#language_button").html("NUM");
        } 
        else if(TextAction.SettingValueLanguage == TextAction.indexNum){
            TextAction.SettingValueLanguage = TextAction.indexAll;
            $("#language_button").html("ALL");
        }
    });
    
/*  $('.nav-settings-btn').click(function() {
        
    });*/
    
    $("#suggestion_buttons").hide();
    $("#letter_backup1").click(function() {
        var str = $("#outputbox").val();
        console.log(str);
        $("#outputbox").val(str.substring(0, str.length - 1) + letter_backup1);
        $("#suggestion_buttons").hide();
        actionCheck($("#outputbox").val());
    });
    $("#letter_backup2").click(function() {
        var str = $("#outputbox").val();
        console.log(str);
        $("#outputbox").val(str.substring(0, str.length - 1) + letter_backup2);
        $("#suggestion_buttons").hide();
        actionCheck($("#outputbox").val());
    });
    $("#letter_backup3").click(function() {
        var str = $("#outputbox").val();
        console.log(str);
        $("#outputbox").val(str.substring(0, str.length - 1) + letter_backup3);
        $("#suggestion_buttons").hide();
        actionCheck($("#outputbox").val());
    });

    $('#drawarea').fancygestures(
        function(letter, letter_backup1, letter_backup2, letter_backup3) {
        callbackfunction(letter, letter_backup1, letter_backup2, letter_backup3);
    });
})

function initUiElements() {
    
}

function callbackfunction(letter, letter_backup1, letter_backup2, letter_backup3) {
        // document.getElementById('outputbox').innerHTML += letter;
        $("#outputbox").val($("#outputbox").val()+letter);
        
        if(ActionCheckTimer != null) {
            clearInterval(ActionCheckTimer);                
        }       
        
        //if(EnableSuggestionButtons == true) {
        if(TextAction.wordSuggestion) {
            console.log(letter + " / " + letter_backup1 + " / " + letter_backup2 + " / " + letter_backup3);
            $("#suggestion_buttons").show();
            $("#letter_backup1").html(letter_backup1);
            $("#letter_backup2").html(letter_backup2);
            $("#letter_backup3").html(letter_backup3);
        }
        
        ActionCheckTimer = setInterval(function () { 
            actionCheck($("#outputbox").val());
            clearInterval(ActionCheckTimer);    
        }, 500);
}
    

function actionCheck(data) {
    // console.log("[action.js] : actionCheck(): data = " + data);
    
    // __1. check one char
    if(data.length == 1) {
        if ("c" == data || "C" == data) {
            var call = new MozActivity({
                name: "dial",
                data: {
                     number: ""
                }
            });
        }
    }
    // __2. check last char
    if(data.length > 0) {
        var lastChar = data.charAt(data.length-1);
    
        if("Y" == lastChar || "y" == lastChar) {
            actionYouTube(data);
        } else if("?" == lastChar) {
            actionBrowser(data);
        } else if("=" == lastChar) {
            if(isRightFormula(data)) {
                console.log("isRightFormula : true ")
                actionCalculator(data);
            } else {
                console.log("isRightFormula : false ")
            }
        } else if ("c" == lastChar || "C" == lastChar) {
            var strNum = data.substr(0, data.length-1);         
            var call = new MozActivity({
                 name: "dial",
                 data: {
                     number: strNum
                 }
            });
        } else if( "m" == lastChar || "M" == lastChar) {
            actionSMS(data);
        }
    }
}

function actionSMS(data) {
        var sms = new MozActivity({
             "name": "new",
             "data": {
                "type": "websms/sms",
                "number": "1234"
             }
        });
}

function actionYouTube(data) {
    if(data.length == 1) {
        // alert("TODO : Start YouTube Application");
    } else {
        var keyword = data.substring(0,data.length-1);
        // alert("TODO : Start YouTube Application & Search "+keyword);
    }
}

function actionBrowser(data) {
    // TODO : load browser setting value 
    var setting = TextAction.searchEngine;
    var urlString = "";
    
    switch (setting) {
        case TextAction.indexNaver :
            if(data.length == 1) {
                urlString = TextAction.urlNaver;
            } else {
                var search_keyword = data.substring(0,data.length-1);
                urlString = TextAction.urlSearchNaver+search_keyword;
            }
        break;
        
        case TextAction.indexDaum : 
            if(data.length == 1) {
                urlString = TextAction.urlDaum;
            } else {
                var search_keyword = data.substring(0,data.length-1);
                urlString = TextAction.urlSerachDaum+search_keyword;
            }
        break;
        
        case TextAction.indexNate : 
            if(data.length == 1) {
                urlString = TextAction.urlNate;
            } else {
                var search_keyword = data.substring(0,data.length-1);
                urlString = TextAction.urlSerachNate+search_keyword;
            }
        break;
        
    }
    
    var openURL = new MozActivity({
        "name" : "view",
        "data" : {
            "type" : "url",
            "url" : urlString
        }
    }); 
}
 
function actionCalculator(data) {
    console.log("[action.js] : actionCalculator()")

    //var result = calculateElement();
    
    var result = 0;
    if(devideByToken(data)) result = calculateElement();
    else {
        result = document.getElementById('outputbox').value;
        result = result.substring(0,result.length-1)
    }
    document.getElementById('outputbox').value = result;
}

function calculate(val1, val2, symbol) {
    var result = 0;
    var num1 = Number(val1);
    var num2 = Number(val2);
    if(symbol == '+') result = num1 + num2; 
    else if(symbol == '-') result = num1 - num2; 
    else if(symbol == '*' || symbol == 'x' || symbol == 'X') result = num1 * num2; 
    else if(symbol == '/') result = num1 / num2; 

    return result;
}

function calculateElement() {
    while(element.length != 1) {
        var num1 = element[0];
        element.splice(0,1);//remove(0);
        var symbol = element[0];
        element.splice(0,1);//remove(0);
        var num2 = element[0];
        element.splice(0,1);// remove(0);
         
        element.splice(0, 0, calculate(num1, num2, symbol)); //add(0, calculate(num1, num2, symbol));
         
    }
    
    return element[0];
}

function devideByToken(data) {

        element = new Array();
        var mathSymbolIndexArray = getMathSymbolIndexArray(data);

        var start = 0;
        var end = 0;
        
        for(var i=0;i<mathSymbolIndexArray.length; i++) {           
            end = mathSymbolIndexArray[i];
            var character = data.substring(start, end);
            if(isNaN(character))return false;
            if(start !=0 && (element[element.length-1]=='X' || element[element.length-1]=='x' || 
                             element[element.length-1]=='*' || element[element.length-1]=='/' )) {
                var symbol = element[element.length-1];
                element.splice(element.length-1,1);// element.remove(element.length-1); 
                var num1 = element[element.length-1];
                element.splice(element.length-1,1);// element.remove(element.length-1);
                var num2 = character;

                element.push(calculate(num1, num2, symbol) + '');
                element.push(data.charAt(end) + '');
                
            } else {
                element.push(character);
                element.push(data.charAt(end) + '');
            }
            start = end + 1;
        }
        element.splice(element.length-1,1);// element.remove(element.length-1);
        
        for(var i=0;i<element.length;i++) {
            if(element[i] == '=')return false;      

        }
        return true;
     
}

function isRightFormula(data) {
    var mathSymbolIndexArray = getMathSymbolIndexArray(data);
    
    // none or only one math symbol
    if (mathSymbolIndexArray.length < 2) {
        console.log("none or only one math symbol");
        return false;
    }

    // first char check
    if (mathSymbolIndexArray[0] == 0) {
        console.log("first char check");
        return false;
    }

    // continuous math symbol
    for ( i = 0; i < mathSymbolIndexArray.length; i++) {
        if (mathSymbolIndexArray[i] + 1 == mathSymbolIndexArray[i + 1]) {
            console.log("continuous math symbol");
            return false;
        }
    }

    // TODO : ....
    // TODO : analyze token is number
    // TODO : check symbol '=' not last index

    return true;
}

function getMathSymbolIndexArray(data) {
    var mathSymbolIndexArray = new Array();
    
    // __1. remove newline char & blank & symbol blank
    data = data.replace(/^\s*/,'');
    data = data.replace(/\s*$/,'');
    

    // __2. find
    for(var i=0;i<data.length;i++) {
        var character = data.charAt(i);
        if(character=='+' || character=='-' || character=='*' || character=='x' || character=='X' || character=='/' || character=='=') {
            mathSymbolIndexArray.push(i);
            
        }
    }
    return mathSymbolIndexArray;
}
