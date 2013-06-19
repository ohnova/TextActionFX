var defaultGesture = '?/c/m/>/y/!/@';
var savedGesture = '';
var gesture;

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
	
}

function LoadFunction() {

	
}

function getGesture() {
	gesture = defaultGesture.split('/');
	var output = '';
	
	output += '<ul>';
	for(var i=0;i<gesture.length;i++) {
		output += '<li>'+ gesture[i] +'</li>';
	}
	output += '</ul>'
	
	document.getElementById('command-content').innerHTML = output;
}

window.onload = function() {
	if(window.localStorage) {
		
		loadLocalStorage();		
		
		document.getElementById('wordsuggestion').onclick = saveLocalStorageForWordSuggestion;
		document.getElementById('engine').onchange = saveLocalStorageForEngine;
	} else {
		alert('fail to save settings');
	}
	

	getGesture();
	LoadFunction();
};