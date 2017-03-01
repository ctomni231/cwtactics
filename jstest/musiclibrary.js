// This class will play music from different sources

window.onload = function(){
	
	// Music 
	console.log("It goes here at least");
	var text = document.getElementById("textBox");
	
	var play = document.getElementById("play");
	play.onchange = function(){
		if(play.checked == 1){
			console.log("And it can sense the play check");
			
			// This makes a whole new audio object
			var audio = document.getElementById("music");
			if(audio)
				audio.parentNode.removeChild(audio);
			audio = document.createElement("audio");
			document.body.appendChild(audio);
			audio.setAttribute("id", "music");
			audio.setAttribute("style", "display:none");
			audio.setAttribute("autoplay", "autoplay");
			audio.innerHTML = "<source src='"+text.value+"' type='audio/mpeg' >";
			audio.play();
			
		}
	}
	
	var loop = document.getElementById("loop");
	loop.onchange = function(){
		if(loop.checked == 1){
			console.log("And it can sense the loop check");
			
			// This makes a whole new audio object
			var audio = document.getElementById("music");
			if(audio)
				audio.parentNode.removeChild(audio);
			audio = document.createElement("audio");
			document.body.appendChild(audio);
			audio.setAttribute("id", "music");
			audio.setAttribute("style", "display:none");
			audio.setAttribute("autoplay", "autoplay");
			//audio.setAttribute("loop", "loop");
			audio.innerHTML = "<source src='"+text.value+"' type='audio/mpeg' >";
			audio.play();
			audio.onended = function(){
				audio.load();
				audio.play();
			}
		}
	}
	
	var stop = document.getElementById("stop");
	stop.onchange = function(){
		if(stop.checked == 1){
			console.log("And it can sense the stop check");
			
			var audio = document.getElementById("music");
			if(audio)
				audio.parentNode.removeChild(audio);
		}
	}
	
	
	console.log("It goes here at least");
	var fxtext = document.getElementById("fxText");
	
	var fxplay = document.getElementById("fxplay");
	fxplay.onchange = function(){
		if(fxplay.checked == 1){
			console.log("And it can sense the play check");
			
			// This makes a whole new audio object
			var audio = document.getElementById("sound");
			if(audio){
				audio.innerHTML = "";
				audio.parentNode.removeChild(audio);
			}
			audio = document.createElement("audio");
			document.body.appendChild(audio);
			audio.setAttribute("id", "sound");
			audio.setAttribute("style", "display:none");
			audio.setAttribute("autoplay", "autoplay");
			audio.innerHTML = "<source src='"+fxtext.value+"' type='audio/wav' >";
			audio.play();
			
			var bgsound = document.getElementById("iesound");
			if(bgsound)
				bgsound.parentNode.removeChild(bgsound);
			bgsound = document.createElement("bgsound");
			document.body.appendChild(bgsound);
			bgsound.setAttribute("id", "iesound");
			bgsound.setAttribute("style", "display:none");
			bgsound.setAttribute("src", fxtext.value);
				
		}
	}
	
	var fxloop = document.getElementById("fxloop");
	fxloop.onchange = function(){
		if(fxloop.checked == 1){
			console.log("And it can sense the loop check");
			
			// This makes a whole new audio object
			var audio = document.getElementById("sound");
			if(audio){
				audio.innerHTML = "";
				audio.parentNode.removeChild(audio);
			}
			audio = document.createElement("audio");
			document.body.appendChild(audio);
			audio.setAttribute("id", "sound");
			audio.setAttribute("style", "display:none");
			audio.setAttribute("autoplay", "autoplay");
			//audio.setAttribute("loop", "loop");
			audio.innerHTML = "<source src='"+fxtext.value+"' type='audio/wav' >";
			audio.play();
			audio.onended = function(){
				audio.load();
				audio.play();
			}
			
			var bgsound = document.getElementById("iesound");
			if(bgsound)
				bgsound.parentNode.removeChild(bgsound);
			bgsound = document.createElement("bgsound");
			document.body.appendChild(bgsound);
			bgsound.setAttribute("id", "iesound");
			bgsound.setAttribute("style", "display:none");
			bgsound.setAttribute("src", fxtext.value);
			bgsound.setAttribute("loop", "infinite");
		}
	}
	
	var fxstop = document.getElementById("fxstop");
	fxstop.onchange = function(){
		if(fxstop.checked == 1){
			console.log("And it can sense the stop check");
			
			var audio = document.getElementById("sound");
			if(audio){
				audio.innerHTML = "";
				audio.parentNode.removeChild(audio);
			}
				
			var bgsound = document.getElementById("iesound");
			if(bgsound){
				bgsound.setAttribute("src", "");
				bgsound.parentNode.removeChild(bgsound);
			}
		}
	}
	
	
}