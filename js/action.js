var actionCheckTimer;
var EnableSuggestionButtons = true;


$(document).ready(function() {
	// element' HTML value initialization.

	$("#outputbox").val("");
	$("#clear_button").click(function() {
		$("#outputbox").val("");
	});
	
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
	

	$('#drawarea').fancygestures(function(letter, letter_backup1, letter_backup2, letter_backup3) {
		callbackfunction(letter, letter_backup1, letter_backup2, letter_backup3);
	});
})

function initUiElements() {
	
}

function callbackfunction(letter, letter_backup1, letter_backup2, letter_backup3) {
		// document.getElementById('outputbox').innerHTML += letter;
		$("#outputbox").val($("#outputbox").val()+letter);
		
		if(actionCheckTimer != null) {
			clearInterval(actionCheckTimer);				
		}		
		
		if(EnableSuggestionButtons == true) {
			console.log(letter + " / " + letter_backup1 + " / " + letter_backup2 + " / " + letter_backup3);
			$("#suggestion_buttons").show();
			$("#letter_backup1").val(letter_backup1);
			$("#letter_backup2").val(letter_backup2);
			$("#letter_backup3").val(letter_backup3);
		}
		
		actionCheckTimer = setInterval(function () { 
       	 	actionCheck($("#outputbox").val());
       	 	clearInterval(actionCheckTimer);	
        }, 500);
}
	

function actionCheck(data) {
	console.log("[action.js] : actionCheck(): data = " + data);
	
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
	
		if("Y" == lastChar) {
			actionYouTube(data);
		} else if("?" == lastChar) {
			actionBrowser(data);
		} else if("=" == lastChar) {
			if(isRightFormula(data) == true) {
				console.log("isRightFormula : true ")
				var result = actionCalculator(data);
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
		}
	}
}

function actionYouTube(data) {
	if("Y" == data) {
		alert("TODO : Start YouTube Application");
	} else {
		keyword = data.substring(0,data.length-1);
		alert("TODO : Start YouTube Application & Search "+keyword);
	}
}

function actionBrowser(data) {
	if("Y" == data) {
		alert("TODO : Start Browser Application");
	} else {
		keyword = data.substring(0,data.length-1);
		alert("TODO : Start Browser Application & Search "+keyword);
	}
}
 
function actionCalculator(data) {
	console.log("[action.js] : actionCalculator()")
	var elements = devideByToken(data);
	
	var result = calculateElement(elements);
	$("#outputbox").val(result);
}

function calculate(num1, symbol, num2){
	var result;

	if (("+") == symbol) {
		result = num1 + num2;
	}
	else if (("-") == symbol) {
		result = num1 - num2;
	}
	else if (("*") == symbol|| ("x") == symbol || ("X") == symbol) {
		result = num1 * num2;
	}
	else if (("/") == symbol) {
		result = num1 / num2;
	}
	
	return result;
}

function calculateElement(elements) {
	var elements_count = elements.length;
	
	for(var i = 0; i < elements.length ; i+=2) {
		if(i+2 <= elements.length) {
			var result = calculate(elements[i],elements[i+1],elements[i+2]);
			elements[i+2] = result;	
			// console.log("i="+i+ "*** "+ result);
		}
	}
	return result;
}

function devideByToken(data) {
	var mathSymbolIndexArray;
	var elements = new Array();
	
	var elements_count = 0;
	var start = 0;
	var end = 0;
	
	mathSymbolIndexArray = getMathSymbolIndexArray(data);
	for(var i=0;i<mathSymbolIndexArray.length;i++) {
		end = mathSymbolIndexArray[i];
		var currentToken = data.substring(start,end);
		
		// TODO : check analyze token is number 
		// TODO : "*", "/" priority handling
		
		elements[elements_count++] = currentToken;
		if(data.charAt(end) != "="){
			elements[elements_count++] = data.charAt(end);	
		}
		start=end+1;
	}
	return elements;
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
	var count = 0;
	var mathSymbolIndexArray = new Array();
	
	// __1. remove newline char & blank & symbol blank
	data = data.replace("\n", "");
   	data = data.replace(" ", "");
   	data = data.replace("	", "");
	

	// __2. find
	for (var i = 0; i < data.length; i++) {
		console.log(i+"->"+data.charAt(i));
		var character = data.charAt(i) + "";
		if ("+" == character || "-" == character || "*" == character || 
			"/" == character || "x" == character || "X" == character || "=" == character) {
			console.log("index --> " + i);
			mathSymbolIndexArray[count] = i;
			count++;
		}
	}
	
	return mathSymbolIndexArray;
}

