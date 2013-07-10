var appsByOrigin = Object.create(null);

function getApps() {
	var apps = [];
	for ( var origin in appsByOrigin) {
		apps.push(appsByOrigin[origin]);
	}
	return apps;
}

function getLaunch(data) {
	var appMgr = navigator.mozApps.mgmt;
	appMgr.getAll().onsuccess = function onsuccess(event) {
		var apps = event.target.result;
		apps.forEach(function eachApp(app) {
			appsByOrigin[app.origin] = app;

		});
		var i = 0;
		var arraylist = getApps();
		while(i < arraylist.length) {
			if(arraylist[i].manifest.name == data) {
				arraylist[i].launch();
				break;
			}
			i++;
		}
		
	};
}

function initApps() {
	// need permission --> "webapps-manage":{}
	var appMgr = navigator.mozApps.mgmt;

	appMgr.getAll().onsuccess = function onsuccess(event) {
		var apps = event.target.result;
		apps.forEach(function eachApp(app) {
			appsByOrigin[app.origin] = app;

		});
		var arraylist = getApps();
		var output = '<option selected="selected">Make a choose application</option>';
		for ( var i in arraylist) {
			output += '<option>' + arraylist[i].manifest.name + '</option>';
		}
		document.getElementById('app_info').innerHTML = output;
	};
}
var PrevValue = 0;
function addCommand() {
	document.getElementById("app_info").selectedIndex = 0;
	document.getElementById('selected_app').innerHTML = '';
	initApps();
	document.getElementById("_gesture").onchange = function() {
		var str = $("#_gesture").val();
		if (str.length >= 2) {
			$("#_gesture").val(str.substring(str.length - 1, str.length))
		}
	};

	document.getElementById('app_info').onchange = function() {
		var value = document.getElementById('app_info').selectedIndex;
		if (value != 0) {
			document.getElementById('selected_app').innerHTML = getApps()[value - 1].manifest.name;	
			PrevValue = value;
		} else {
			document.getElementById('app_info').options[PrevValue].selected = 'selected';
		}
	};

	$('#_save').click(function() {
		var selectedApp = document.getElementById('selected_app').innerHTML;
		if (selectedApp != "" && $("#_gesture").val().length != 0) {
			newGuesture += "/" + $("#_gesture").val();
			LaunchGesture += "/" + document.getElementById('selected_app').innerHTML;
			
			$("#_gesture").val("");
			$('#setting-add-command').hide();
			localStorage.setItem('savedGesture', newGuesture);
			localStorage.setItem('savedLaunchGesture', LaunchGesture);
			getGesture();
		}
	});

	$('#_link_add_command').click(function() {
		$('#app_info').focus();
	});

	$('#_back').click(function() {
		$("#_gesture").val("");
		$('#setting-add-command').hide();
	});

	$('#_delete').click(function() {
		$("#_gesture").val("");
	});

	$('#_drawable').fancygesturesFORAC(function(letter) {
		callbackfunctionFORAC(letter);
	});

}

function callbackfunctionFORAC(letter) {
	var str = letter;
	if (letter >= 2) {
		str = str.substring(str.length - 1, str.length);
	}
	$("#_gesture").val(str);

}