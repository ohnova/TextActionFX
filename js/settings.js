var defaultGesture = '?/c/m';
var loadGesture = '';
var newGuesture = ''; // key is savedGesture
var LaunchGesture = ''; // key is savedLaunchGesture

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
	loadEngineText();
}

function loadEngineText() {
	var index = Number(localStorage.getItem('engine'));
	document.getElementById('selected-engine').innerHTML = indexArray[index];	
}
function getAllGesture() {
	var gesture = '';
	if(localStorage.getItem('savedGesture')!=null) {
		newGuesture = localStorage.getItem('savedGesture');
		LaunchGesture = localStorage.getItem('savedLaunchGesture');
		loadGesture = defaultGesture + newGuesture;
	}
	else loadGesture = defaultGesture;
	gesture = loadGesture.split('/');
	
	return gesture;
}
function getGesture() {
	
	var gesture = getAllGesture();

	var output = '';

	for(var i=0;i<gesture.length;i++) {
		output += '<li>'+ gesture[i] +'</li>';
	}

	
	document.getElementById('command-content').innerHTML = output;
	$('#setting-add-command').hide();
	$('#add-command').click(function() {
		$('#setting-add-command').show();
		addCommand();
		
	});

}

function linkEngineSelect() {
	$('#setting_engine').click(function() {
		$('#engine').focus();
	});

}

function showTutorial() {
	$('#tutorial_title').click(function() {
		document.getElementById('tutorial_next').innerHTML = 'Next';
		$('#tutorial_dialog').show();	
		$('#tutorial_page1').show();
		$('#tutorial_page2').hide();
	});
		
	$('#setting-textaction-guide').click(function() {
		document.getElementById('tutorial_next').innerHTML = 'Next';
		$('#tutorial_dialog').show();	
		$('#tutorial_page1').show();
		$('#tutorial_page2').hide();
	});
	
	$('#tutorial_prev').click(function() {
		if(document.getElementById('tutorial_next').innerHTML == 'Done') {
			document.getElementById('tutorial_next').innerHTML = 'Next';
			$('#tutorial_page1').show();
			$('#tutorial_page2').hide();
		} else {
			$('#tutorial_dialog').hide();
		}
	});
	
	$('#tutorial_next').click(function() {
		if(document.getElementById('tutorial_next').innerHTML == 'Done') {
			$('#tutorial_dialog').hide();
		} else {
			document.getElementById('tutorial_next').innerHTML = 'Done';	
			$('#tutorial_page1').hide();
			$('#tutorial_page2').show();
		}
	});

}
function loadWordSuggestions() {
	$('#setting_wordsuggestion').click(function() {
		if(document.getElementById('wordsuggestion').checked)
			document.getElementById('wordsuggestion').checked = false;
		else 
			document.getElementById('wordsuggestion').checked = true;
		saveLocalStorageForWordSuggestion();
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
	
	linkEngineSelect();
	getGesture();
	loadEngineText();
	showTutorial();
	loadWordSuggestions();
};