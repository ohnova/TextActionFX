/**
 * @author P10717
 */
var canvas, ctx, flag = false, prevX = 0, currX = 0, prevY = 0, currY = 0, dot_flag = false;
var recogTimeout = 500;
var timeoutId = 0;

window.onload = function() {
	init();
}
function init() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	w = canvas.width;
	h = canvas.height;

	canvas.addEventListener("mousemove", function(e) {
		findxy('move', e);
	}, false);

	canvas.addEventListener("mousedown", function(e) {
		findxy('down', e)
	}, false);

	canvas.addEventListener("mouseup", function(e) {
		findxy('up', e)
	}, false);

	canvas.addEventListener("mouseout", function(e) {
		findxy('out', e)
	}, false);
}

function draw() {
	ctx.beginPath();
	ctx.moveTo(prevX, prevY);
	ctx.lineTo(currX, currY);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.closePath();
}

function erase() {
	ctx.clearRect(0, 0, w, h);
	//document.getElementById("canvas").style.display = "none";
	timeoutId = 0;

}

function findxy(res, e) {		
	if (res == 'down') {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - canvas.offsetLeft;
		currY = e.clientY - canvas.offsetTop;

		if (timeoutId != 0) {
			clearTimeout(timeoutId);
			timeoutId = 0;
		}
		
		flag = true;
		dot_flag = true;
		if (dot_flag) {
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.fillRect(currX, currY, 2, 2);
			ctx.closePath();
			dot_flag = false;
		}
	}
	if (res == 'up' || res == "out") {
		flag = false;		
		if (timeoutId == 0) {
			timeoutId = setTimeout(function() {
				erase();
			}, recogTimeout);
		}
	}
	if (res == 'move') {
		if (flag) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - canvas.offsetLeft;
			currY = e.clientY - canvas.offsetTop;
			draw();
		}
	}
}
