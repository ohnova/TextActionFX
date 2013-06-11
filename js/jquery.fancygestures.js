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
var strokeCount = 0;

(function($){   
  
  $.fn.fancygestures = function(callbackfunction){   
	
		var gestures = new Array();

		// new gesture data type 
		// (Pattern * StrokeCount)[0] , (Pattern * StrokeCount)[1], ...
		gestures["A"] = "310*3,210*3,710*2,610*2";
		gestures["B"] = "260123401234*2";
		gestures["C"] = "43210*1";
		gestures["D"] = "201234*2";
		gestures["E"] = "043210*3,020*3"; // TODO same pattern "F"
		gestures["F"] = "020*3,220*3,420*2";
		gestures["G"] = "5432107602*3";
		gestures["H"] = "202*3";
		gestures["I"] = "2*1";
		gestures["J"] = "0323456*2";
		gestures["K"] = "271*3";
		gestures["L"] = "46*1,20*1";
		gestures["M"] = "6172*1,217672*2";
		gestures["N"] = "616*1,216*2";
		gestures["O"] = "432107654*1";
		gestures["P"] = "201234*2";    // TODO same pattern "D"
		gestures["Q"] = "43210765431*2";  // TODO same pattern "0, O"
		gestures["R"] = "267012341*2,201234310*2";
		gestures["S"] = "432101234*1";
		gestures["T"] = "02*2";
		gestures["U"] = "21076*1";
		gestures["V"] = "17*1";
		gestures["W"] = "2716*1,2727*1";
		gestures["X"] = "31*2,13*2";
		gestures["Y"] = "1032,32102*2";
		gestures["Z"] = "030*1";
		
		gestures["~"] = "670107*1,701076*1";
		gestures["!"] = "22*2";
		gestures["@"] = "6432107213456701234*1,6543210762134567012*1,6432107213456701234*2,6543210762134567012*2";
		gestures["#"] =	"0022*4,2200*4";
		gestures["$"] = "4321012342*2";
		gestures["%"] = "322*3";
		gestures["^"] =	"71*1";	
		gestures["&"] = "023456707654321*1, 023456707654321*2"
		gestures["?"] = "6701232*2";
		gestures["<"] = "31*1";     	//TODO same pattern X
		gestures[">"] = "13*1";			//TODO same pattern X
		gestures["["] = "420*1";
		gestures["]"] = "024*1";
		
		gestures["*"] = "310*3,130*3,013*3" //TODO same pattern A
		gestures["+"] = "20*2,02*2"
		gestures["="] = "00*2"
		gestures["-"] = "0*1";
		gestures["/"] = "3*1";
		
		gestures["1"] = "37240*1,2*1"
		gestures["2"] = "67012340*1"
		gestures["3"] = "70123401234*1"
		gestures["4"] = "302*2,202*2"
		gestures["5"] = "27012340*2,427012345*1"
		gestures["6"] = "43210765432*1,32106543*1"
		gestures["7"] = "2102*2,202*2,02*1,3670123*1"
		gestures["8"] = "43210123456765*1,5670123432107654*1,07654321012345670*1"
		gestures["9"] = "543210762*1,23456702*1"
		gestures["0"] = "43210765421*1"
		
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
			// console.log("mousedown()");
			clearInterval(recognitionTimer);
			recording = true;
			
			// graphics.clear();
			// graphics.paint();

			lastPositionX = event.clientX-position.left;
			lastPositionY = event.clientY-position.top;	
		});

		$(element).mousemove(function(event) {
			// console.log("mousemove()");
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
			// console.log("mouseup()");
			strokeCount++;
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
			
			result_backup1 = 100000;
			result_backup2 = 100000;
			result_backup3 = 100000;
			
			letter_backup1 = '';
			letter_backup2 = '';
			letter_backup3 = '';
			
			for (x in gestures) {
				matchMove = gestures[x].split(",");
				
				for(y in matchMove) {
					matchData = matchMove[y].split("*");
					matchStroke = matchData[1];
					// console.log("matchStroke = "+ matchStroke);
					// console.log("strokeCount = "+ strokeCount);
					res = costLeven (matchData[0],moves);
					
					if(res <= result_backup1) {
						result_backup3 = result_backup2;
						result_backup2 = result_backup1;
						result_backup1 = res;
						letter_backup3 = letter_backup2;
						letter_backup2 = letter_backup1;
						letter_backup1 = x;
					}
					if(res > result_backup1 && res <= result_backup2) {
						result_backup3 = result_backup2;
						result_backup2 = res;
						letter_backup3 = letter_backup2;
						letter_backup2 = x;
					}
					if(res > result_backup2 && res <= result_backup3) {
						result_backup3 = res;
						letter_backup3 = x;
					}
					
					if (res <= result && res < 30 && strokeCount == matchStroke) {		
						// letter_backup3 = letter_backup2;
						// letter_backup2 = letter_backup1;
						// letter_backup1 = letter;
						result = res;
						letter = x;
						console.log("letter = " + letter + "result = " + result);
					}
				}
			}
			
			callbackfunction(letter,letter_backup1,letter_backup2,letter_backup3);
			moves = new Array(0);
			lastPositionX = 0;
			lastPositionY = 0;
			
		 	graphics.clear();
			graphics.paint();
			strokeCount = 0;
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
			console.log("a =" + a + " b =" + b + " :: " + w[x-1][y-1]);
			return w[x-1][y-1];
		}		
	};   
  
})(jQuery);
