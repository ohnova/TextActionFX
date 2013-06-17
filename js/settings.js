var defaultGesture = '?/c/m/>/y/!/@';
var savedGesture = '';
var gesture;

function loadLocalStorage() {
	
	if(localStorage.getItem('wordsuggestion') == "true") {
		document.getElementById('wordsuggestion').checked = true;
	} else {
		document.getElementById('wordsuggestion').checked = false;
	}

	var index = Number(localStorage.getItem('engine'));
	if(localStorage.getItem('engine')==null)
		document.getElementById('engine').options[0].selected = 'selected';
	else 
		document.getElementById('engine').options[index].selected = 'selected';

}

function saveLocalStorageForWordSuggestion() {

	if(document.getElementById('wordsuggestion').checked)
		localStorage.setItem('wordsuggestion', "true");
	else 
		localStorage.setItem('wordsuggestion', "false");

}


function saveLocalStorageForEngine() {

	var value = document.getElementById('engine').selectedIndex;
	localStorage.setItem('engine', value);
	
}

function LoadFunction() {
	// reset
	hideCommand();
	hideGuide();
	
	// init
	document.getElementById('setting-command-setting').onclick = showCommand;
	document.getElementById('command-done').onclick = hideCommand;
	document.getElementById('setting-textaction-guide').onclick = showGuide;
	document.getElementById('guide_done').onclick = hideGuide;
}
function showGuide() {
	document.getElementById('setting-textaction-guide-content').style.display='block';
}

function hideGuide() {
	document.getElementById('setting-textaction-guide-content').style.display='none';
}

function showCommand() {
	getGesture();
	document.getElementById('setting-command-setting-content').style.display='block';
}

function hideCommand() {
	document.getElementById('setting-command-setting-content').style.display='none';
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
	

	LoadFunction();
};