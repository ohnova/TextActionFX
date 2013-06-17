/* function loadLocalStorage() {
	
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

window.onload = function() {
	if(window.localStorage) {
		
		loadLocalStorage();		
		
		document.getElementById('wordsuggestion').onclick = saveLocalStorageForWordSuggestion;
		document.getElementById('engine').onchange = saveLocalStorageForEngine;
	} else {
		alert('fail to save settings');
	}
}; */