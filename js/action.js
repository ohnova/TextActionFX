$(document).ready(function () {   
	$('#drawarea').fancygestures(function (data) {
		document.getElementById('outputbox').innerHTML += data;		
	})
})