var defaultGesture = '?/c/m/>/y/!/@/t/e/s/t';
var savedGesture = '';
var gesture;
var indexArray = [ "naver", "daum", "nate"];

function loadLocalStorage() {
	
	if(localStorage.getItem('wordsuggestion') == "true") {
		TextAction.wordSuggestion = true;
		document.getElementById('wordsuggestion').checked = true;
	} else {
		TextAction.wordSuggestion = false;
		document.getElementById('wordsuggestion').checked = false;
	}

	var index = Number(localStorage.getItem('engine'));
	if(localStorage.getItem('engine')==null) {
		TextAction.searchEngine = 0;
		document.getElementById('engine').options[0].selected = 'selected';
	}
	else {
		TextAction.searchEngine = index;
		document.getElementById('engine').options[index].selected = 'selected';
	}

}

function saveLocalStorageForWordSuggestion() {

	if(document.getElementById('wordsuggestion').checked) {
		TextAction.wordSuggestion = true;
		localStorage.setItem('wordsuggestion', "true");
	}
	else {
		// temp hide
		$("#suggestion_buttons").hide();
		TextAction.wordSuggestion = false;
		localStorage.setItem('wordsuggestion', "false");
	}

}


function saveLocalStorageForEngine() {

	var value = document.getElementById('engine').selectedIndex;
	TextAction.searchEngine = value;
	localStorage.setItem('engine', value);
	LoadEngineText();
}

function LoadEngineText() {
	var index = Number(localStorage.getItem('engine'));
	/*if(index == 0) document.getElementById('selected-engine').innerHTML = "naver";
	else if(index == 1) document.getElementById('selected-engine').innerHTML = "daum";
	else if(index == 2) document.getElementById('selected-engine').innerHTML = "nate";*/
	document.getElementById('selected-engine').innerHTML = indexArray[index];	
}

function getGesture() {
	gesture = defaultGesture.split('/');
	var output = '';
	
	//output += '<ul>';
	for(var i=0;i<gesture.length;i++) {
		output += '<li>'+ gesture[i] +'</li>';
	}
	//output += '</ul>'
	
	document.getElementById('command-content').innerHTML = output;
}

function test() {
	$('#test1').click(function() {
		$('#engine').focus();
	});

}

window.onload = function() {
	if(window.localStorage) {
		
		loadLocalStorage();		
		
		document.getElementById('wordsuggestion').onclick = saveLocalStorageForWordSuggestion;
		document.getElementById('engine').onchange = saveLocalStorageForEngine;
	} else {
		alert('fail to save settings');
	}
	

	test();
	
	getGesture();
	LoadEngineText();
};