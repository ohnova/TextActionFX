/*

jQuery Fancy Gestures
Copyright (c) 2009 Anant Garg (http://anantgarg.com)

Version: 1.0
Url: http://anantgarg.com/2009/05/21/jquery-fancy-gestures

Original ActionScript Version: Didier Brun (http://www.bytearray.org/?p=91) (didier@bytearray.org)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var isWatingForNextInput = false;
var recognitionTimer;


(function($){   
  
  $.fn.fancygestures = function(callbackfunction){   
	
		var gestures = new Array();

		// Add new gestures here
		// gestures["RETURNDATA"] = "MOUSESEQUENCE";

		gestures["A"] = "53,71,310,210";
		gestures["B"] = "260123401234";
		gestures["C"] = "43210";
		gestures["D"] = "201234";
		gestures["E"] = "043210";
		gestures["F"] = "0320,420";
		gestures["G"] = "5432107602";
		gestures["H"] = "202";
		gestures["I"] = "020";
		gestures["J"] = "0323456";
		gestures["K"] = "3456701";
		gestures["L"] = "46,20";
		gestures["M"] = "217672";
		gestures["N"] = "216,62176,2106";
		gestures["O"] = "432107654";
		gestures["P"] = "670123456";  	// TODO same pattern "D"
		gestures["Q"] = "43210765431";  // TODO same pattern "0, O"
		gestures["R"] = "267012341,201234310";
		gestures["S"] = "432101234";
		gestures["T"] = "02";
		gestures["U"] = "21076";
		gestures["V"] = "35,17";
		gestures["W"] = "2716,2727";
		gestures["X"] = "31,13";
		gestures["Y"] = "1032,32102";
		gestures["Z"] = "030";
		
		gestures["~"] = "670107,701076"
	//	gestures["!"] =
		gestures["@"] = "6432107213456701234"
	//	gestures["#"] =	
	//	gestures["$"] = 
	//	gestures["%"] =
	//	gestures["^"] =		
		gestures["&"] = "023456707654321"
	//	gestures["?"] = "6701232";
	//	gestures["<"] = "31";     	//TODO same pattern X
	//	gestures[">"] = "13";		//TODO same pattern X
		gestures["["] = "420";
		gestures["]"] = "024";
		
		gestures["+"] = "20,02"
		gestures["="] = "00"
		gestures["-"] = "0";
		
		gestures["1"] = "37240"
		gestures["2"] = "67012340"
		gestures["3"] = "70123401234"
		gestures["4"] = "302"
		gestures["5"] = "2701234"
		gestures["6"] = "43210765432,32106543"
		gestures["7"] = "602,3670123"
		gestures["8"] = "43210123456765,5670123432107654,07654321012345670"
		gestures["9"] = "543210762,23456702"
		gestures["0"] = "43210765421"
		
		// Color & Width of Stroke
		var color = "#666666";
		var strokeWidth = 4;

		var element = this;   
		var graphics;
		var position;

		var recording = false;
		var lastPositionX = 0;
		var lastPositionY = 0;
		var moves = new Array;
		 
		var sectorRad = Math.PI*2/8;
		var anglesMap = new Array;
		var step = Math.PI*2/100;
		var sector;
		var timer;

		for (var i = -sectorRad/2; i<=Math.PI*2-sectorRad/2; i+=step){
			sector=Math.floor((i+sectorRad/2)/sectorRad);
			anglesMap.push(sector);
		}
		
		function initialize() {
			graphics = new jsGraphics($(element).attr('id')); 
			position = $(element).offset();
		}

		initialize();

		$(element).mousedown(function(event) {
			console.log("mousedown()");
			clearInterval(recognitionTimer);
			recording = true;
			
			// graphics.clear();
			// graphics.paint();

			lastPositionX = event.clientX-position.left;
			lastPositionY = event.clientY-position.top;	
		});

		$(element).mousemove(function(event) {
			console.log("mousemove()");
			if(recording == true) {
				var msx = (event.clientX-position.left);
				var msy = (event.clientY-position.top);
				
				var difx = (msx-lastPositionX);
				var dify = (msy-lastPositionY);

				var sqDist = (difx*difx+dify*dify);
				var sqPrec= (8*8);
						
				if (sqDist>sqPrec){
					graphics.setStroke(strokeWidth);
					graphics.setColor(color);
					graphics.drawLine(lastPositionX, lastPositionY, msx,msy);
					graphics.paint();
					lastPositionX=msx;
					lastPositionY=msy;
					addMove(difx,dify);
				}
			}
		});

		$(element).mouseup(function(e) {
			console.log("mouseup()");
			recording = false;
			recognitionTimer = setInterval(function () { 
	       	 	recognitionStart();
	       	 	clearInterval(recognitionTimer);	
     	   	}, 500);
			
		});
		
		function recognitionStart() {
			// recording = false;
			
			console.log(moves);
			result = 100000;
			letter = '';
			
			for (x in gestures) {
				matchMove = gestures[x].split(',');
				for(y in matchMove) {
					res = costLeven (matchMove[y],moves);
					if (res < result && res < 30) {		
						result = res;
						letter = x;
					}
				}
			}
			
			callbackfunction(letter);
			moves = new Array(0);
			lastPositionX = 0;
			lastPositionY = 0;
			
		 	graphics.clear();
			graphics.paint();
		}
		
		function addMove(dx,dy) {
			var angle = Math.atan2(dy,dx)+sectorRad/2;
			if (angle<0) angle+=Math.PI*2;
			var no = Math.floor(angle/(Math.PI*2)*100);
			moves.push(anglesMap[no]);	
		}

		function difAngle(a,b) {
			var dif =Math.abs(a-b);
			if (dif>8/2)dif=8-dif;
			return dif;
		}

		function fill2DTable(w,h,f){
			var o = new Array(w);
			for (var x=0;x<w;x++){
				o[x]=new Array(h);
				for (var y=0;y<h;y++)o[x][y]=f;
			}
			return o;
		}
		
		// a : pattern data , b : input character pattern		
		function costLeven(a,b){
			if (a[0]==-1){
				return b.length==0 ? 0 : 100000;
			}

			var d = fill2DTable(a.length+1,b.length+1,0);
			var w = d.slice();

			for (var x=1;x<=a.length;x++){
				for (var y=1;y<b.length;y++){
					d[x][y]=difAngle(a[x-1],b[y-1]);
				}
			}

			for (y=1;y<=b.length;y++)w[0][y]=100000;
			for (x=1;x<=a.length;x++)w[x][0]=100000;
			w[0][0]=0;

			var cost=0;
			var pa;
			var pb;
			var pc;$

			for (x=1;x<=a.length;x++){
				for (y=1;y<b.length;y++){
					cost=d[x][y];
					pa=w[x-1][y]+cost;
					pb=w[x][y-1]+cost;
					pc=w[x-1][y-1]+cost;
					w[x][y]=Math.min(Math.min(pa,pb),pc)
				}
			}

			return w[x-1][y-1];
		}		
	};   
  
})(jQuery);
