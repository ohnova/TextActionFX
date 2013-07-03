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
		
		function patternDataUpdate() {
			gestures = new Array();
			// (Pattern * StrokeCount)[0] , (Pattern * StrokeCount)[1], ...
			if(TextAction.SettingValueLanguage == TextAction.indexAll 
				|| TextAction.SettingValueLanguage == TextAction.indexEng) {
				// upper case
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
				gestures["W"] = "2716*1,2727*1,21767121217676*1";
				gestures["X"] = "31*2,13*2";
				gestures["Y"] = "1032*1,32102*2";
				gestures["Z"] = "030*1";
			
				// lower case
				gestures["a"] = "6543210621*1";
				gestures["b"] = "26701234*1";
				gestures["c"] = "43210*1"; // TODO same pattern "C"
				gestures["d"] = "54321076*1,543210762*1";
				gestures["e"] = "065432107*1";
				gestures["f"] = "654320*1,54320*1";
				gestures["g"] = "54321076523456*1";
				gestures["h"] = "267012*1";
				gestures["i"] = "22*2";
				gestures["j"] = "123456*2";	
				gestures["k"] = "271*3,26730*1";
				gestures["l"] = "0765321*1";
				gestures["m"] = "01236701267012*1";
				gestures["n"] = "01267012*1"; // // TODO same pattern "m, h"
				gestures["o"] = "432107654*1";
				gestures["p"] = "26701234*1";
				gestures["q"] = "654321076232071*1";
				gestures["r"] = "26701*1";
				gestures["s"] = "432101234*1"; // // TODO same pattern "S"
				gestures["t"] = "02107*2";
				gestures["u"] = "20762*1";
				gestures["v"] = "17*1";
				gestures["w"] = "2107621076*1";
				gestures["x"] = "0123434323210*2";
				gestures["y"] = "2102*2"
				gestures["z"] = "03101*2"
			
				// symbol
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
			}
			
			if(TextAction.SettingValueLanguage == TextAction.indexAll 
				|| TextAction.SettingValueLanguage == TextAction.indexNum) {
				// number
				gestures["1"] = "37240*1,2*1"
				gestures["2"] = "67012340*1"
				gestures["3"] = "70123401234*1"
				gestures["4"] = "302*2,202*2,32103232*2"
				gestures["5"] = "27012340*2,427012345*1"
				gestures["6"] = "43210765432*1,32106543*1"
				gestures["7"] = "2102*2,202*2,02*1,3670123*1"
				gestures["8"] = "43210123456765*1,5670123432107654*1,07654321012345670*1"
				gestures["9"] = "543210762*1,23456702*1"
				gestures["0"] = "43210765421*1"
			}
			
			// math symbol
			gestures["*"] = "310*3,130*3,013*3" //TODO same pattern A
			gestures["+"] = "20*2,02*2"
			gestures["="] = "00*2"
			gestures["-"] = "0*1";
			gestures["/"] = "3*1";
		}
		
		patternDataUpdate();
		
		$("#language_button").click(function() {
  			patternDataUpdate();
  		});
		
		// color & width of stroke
		var color = "#666666";
		var strokeWidth = 4;

		var element = this;   
		var graphics;					// must be initialize by turn
		var position;					// must be initialize by turn
		
		// for checking next character
		var lastDownEventX = 0; 		// must be initialize by turn
		var lastDownEventY = 0; 		// must be initialize by turn
		var lastUpEventX = 0; 			// must be initialize by turn
		var lastUpEventY = 0; 			// must be initialize by turn
		var maxMoveX = 0; 				// must be initialize by turn
		var maxMoveY = 0; 				// must be initialize by turn

		var recording = false;			// must be initialize by turn
		var lastPositionX = 0;			// must be initialize by turn
		var lastPositionY = 0;			// must be initialize by turn
		
		var moves = new Array;			// must be initialize by turn
		var strokeCount = new Array();  // must be initialize by turn
		var strokeCountIndex = 0;	    // must be initialize by turn
		
		var firstX = 0;
		var firstY = 0;
		
		var sectorRad = Math.PI*2/8;
		var anglesMap = new Array;
		var step = Math.PI*2/100;
		var sector;
		var timer;
		
		var canvasWidth = $("#drawarea").width();
		var canvasHeight = $("#drawarea").height();
        
        
         

		for (var i = -sectorRad/2; i<=Math.PI*2-sectorRad/2; i+=step){
			sector=Math.floor((i+sectorRad/2)/sectorRad);
			anglesMap.push(sector);
		}
		
		function initialize() {
			graphics = new jsGraphics($(element).attr('id')); 
			position = $(element).offset();
			strokeCount[strokeCountIndex] = 0;
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
            if(firstX == 0) {
                firstX = lastPositionX;
                firstY = lastPositionY;
            }
            
			// check next char 
			if(isNextChar(event.clientX,event.clientY)) {
					// display next character start point. red 
					graphics.setStroke(strokeWidth);
					graphics.setColor("#ff1493");
					var msx = (event.clientX-position.left);
					var msy = (event.clientY-position.top);
					// console.log("lastPositionX : " + lastPositionX + " lastPositionY : " + lastPositionY);
					graphics.fillArc(lastPositionX-5, lastPositionY-5,10,10,10,10);
					graphics.paint();
					
					// push "#" to "moves"
					moves.push("#");	
					strokeCountIndex++;
					strokeCount[strokeCountIndex] = 0;
			}
		
			// console.log("down X : " + event.clientX + " donw Y : " + event.clientY);
			lastDownEventX = event.clientX;
			lastDownEventY = event.clientY;
			
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
				
				if(maxMoveX < event.clientX){
					maxMoveX = event.clientX;
				}
				if(maxMoveY < event.clientY){
					maxMoveY = event.clientY;	
				}
				
			}
		});

		$(element).mouseup(function(event) {
			// console.log("mouseup()");
			strokeCount[strokeCountIndex]++;
			
			recording = false;
			recognitionTimer = setInterval(function () { 
	       	 	recognitionStart();
	       	 	clearInterval(recognitionTimer);	
     	   	}, 500);
     	   	
     	   	// console.log("up X : " + event.clientX + " up Y : " + event.clientY);
     	   	lastUpEventX = event.clientX;
			lastUpEventY = event.clientY;
		});
		
		function isNextChar(downX,donwY) {
			if(lastDownEventX == 0 || lastDownEventY == 0){
				return false;
			}
			
			if(downX > maxMoveX + (canvasWidth / 20)) {
				// console.log("** downX > maxMoveX");
				return true;
			}
			
			if(downX > lastDownEventX + (canvasWidth/5)) {
				// console.log("** downX > lastDownEventX + (canvasWidth/5)");
				return true;
			}
			return false;
		}
		
		function recognitionStart() {
			// recording = false;
			console.log("> moves = " + moves);
			var movesArray = new Array();
			
			
			var indexI = 0;
			var indexJ = 0;
			movesArray[indexI] = new Array();
			for(i in moves) {
				if(moves[i] != "#"){
					movesArray[indexI][indexJ] = moves[i];
					indexJ++;
				} else {
					indexI ++;
					indexJ = 0;
					movesArray[indexI] = new Array();
				}
			}
			console.log("> movesArray = " + movesArray);
			
			var all_letter = "";
			for(k in movesArray) {
				console.log("> movesArray [" + k + "] = " + movesArray[k]);
				console.log("> strokeCount [" + k + "] = " + strokeCount[k]);
				
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
						res = costLeven (matchData[0],movesArray[k]);
						
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
						
						if (res <= result && res < 30 && strokeCount[k] == matchStroke) {		
							// letter_backup3 = letter_backup2;
							// letter_backup2 = letter_backup1;
							// letter_backup1 = letter;
							result = res;
							letter = x;
							// console.log("letter = " + letter + "result = " + result);
						}
					}
				}
				
				all_letter += letter;
				if(movesArray.length-1 == k) {
				    $("#text_animation").html(all_letter);
                    $("#text_animation").css("top", (firstY + lastUpEventY)/2);
                    $("#text_animation").css("left", (firstX +lastUpEventX)/2);
                    $("#text_animation").fadeIn(300).fadeOut(300);
				}
                
                callbackfunction(letter,letter_backup1,letter_backup2,letter_backup3);
			} 
			
			// initialize value
			moves = new Array(0);
			strokeCount = new Array(0);
			
			strokeCountIndex = 0;
			strokeCount[strokeCountIndex] = 0;
			
			firstY = 0;
			firstX = 0;
			
			lastPositionX = 0;
			lastPositionY = 0;
			
			lastDownEventX = 0;
			lastDownEventY = 0;
			lastUpEventX = 0;
			lastUpEventY = 0;
			maxMoveX = 0;
			maxMoveY = 0;
			
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
			// console.log("a =" + a + " b =" + b + " :: " + w[x-1][y-1]);
			return w[x-1][y-1];
		}		
	};   
  
})(jQuery);
