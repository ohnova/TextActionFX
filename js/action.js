var actionCheckTimer;

$(document).ready(function () {   
	$('#drawarea').fancygestures(function (data) {
		document.getElementById('outputbox').innerHTML += data;
		if(actionCheckTimer != null) {
			clearInterval(actionCheckTimer);				
		}		
		
		actionCheckTimer = setInterval(function () { 
       	 	actionCheck(document.getElementById('outputbox').innerHTML);
       	 	clearInterval(actionCheckTimer);	
        }, 1000);
	})
})

function actionCheck(data) {
	console.log("[action.js] : actionCheck(): data = " + data);
	
	// _1. check one char
	if(data.length == 1) {
		
	}
	// _2. check last char
	if(data.length > 1) {
		var lastChar = data.charAt(data.length -1);
	
		if("Y" == lastChar) {
			// TODO action Youtube 
		}
	
		if(lastChar == "=") {
			actionCalculator(data);
		}
	}
}

function actionCalculator() {
	console.log("[action.js] : actionCalculator()")
}


