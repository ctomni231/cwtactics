// Tic Tac Toe

var tictactoeboxes = [" ", " ", " ", " ", " ", " ", " ", " ", " "]
var playerone = true;


function startGame(){
	var canvas = document.getElementById("theCanvas");
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "white";
	ctx.clearRect(0,0,300,300);
	
	ctx.fillStyle = "black";
	
	// Make the board for TicTacToe
	ctx.beginPath();
	
	//Line 1
	ctx.moveTo(0, 100);
	ctx.lineTo(300, 100);
	
	//Line 2
	ctx.moveTo(0, 200);
	ctx.lineTo(300, 200);
	
	//Line 3
	ctx.moveTo(100, 0);
	ctx.lineTo(100, 300);
	
	//Line 4
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 300);
	
	ctx.stroke();

}

function inGame(event){

	// THis normalizes the mouse
	var mousex = event.clientX - 8;
	var mousey = event.clientY - 50;
	
	// This finds the canvas
	var canvas = document.getElementById("theCanvas");
	var ctx = canvas.getContext("2d");
	ctx.font = 'bold 60px sans-serif';
	
	// THis is the logic part
	
	// Get the position of the mouse
	var posx = "Center"
	if (mousex < 100){
		posx = "Left"
	}	
	if (mousex > 200){
		posx = "Right"
	}
	
	var posy = "Middle"
	if (mousey < 100){
		posy = "Top"
	}	
	if (mousey > 200){
		posy = "Bottom"
	}
	
	// Start the game logic here
	
	if (posx == "Left" && posy == "Top"){
		if(playerone == true){
			ctx.fillText("X", 30, 70);
		}else{
			ctx.fillText("O", 30, 70);
		}
	}
	if (posx == "Center" && posy == "Top"){
		if(playerone == true){
			ctx.fillText("X", 30+100, 70);
		}else{
			ctx.fillText("O", 30+100, 70);
		}
	}
	if (posx == "Right" && posy == "Top"){
		if(playerone == true){
			ctx.fillText("X", 30+200, 70);
		}else{
			ctx.fillText("O", 30+200, 70);
		}
	}
	if (posx == "Left" && posy == "Middle"){
		if(playerone == true){
			ctx.fillText("X", 30, 70+100);
		}else{
			ctx.fillText("O", 30, 70+100);
		}
	}
	if (posx == "Center" && posy == "Middle"){
		if(playerone == true){
			ctx.fillText("X", 30+100, 70+100);
		}else{
			ctx.fillText("O", 30+100, 70+100);
		}
	}
	if (posx == "Right" && posy == "Middle"){
		if(playerone == true){
			ctx.fillText("X", 30+200, 70+100);
		}else{
			ctx.fillText("O", 30+200, 70+100);
		}
	}
	if (posx == "Left" && posy == "Bottom"){
		if(playerone == true){
			ctx.fillText("X", 30, 70+200);
		}else{
			ctx.fillText("O", 30, 70+200);
		}
	}
	if (posx == "Center" && posy == "Bottom"){
		if(playerone == true){
			ctx.fillText("X", 30+100, 70+200);
		}else{
			ctx.fillText("O", 30+100, 70+200);
		}
	}
	if (posx == "Right" && posy == "Bottom"){
		if(playerone == true){
			ctx.fillText("X", 30+200, 70+200);
		}else{
			ctx.fillText("O", 30+200, 70+200);
		}
	}



	// This is the part that draws
	
	
	
	// This part finds the empty HTML div box thingy
	var box = document.getElementById("messagebox");
	box.innerHTML = "Mouse Coordinates: (" + mousex + ", " + mousey + ")<BR> Pos: " + posx + " " + posy;
	
	//ctx.fillStyle = "red";
	//ctx.fillRect(mousex, mousey, 10, 10);
	
	//change the player
	if (playerone == true){
		playerone = false
	}else{
		playerone = true
	}
	
	
}

function resetGame(){
	
	//var box = document.getElementById("messagebox");
	//box.innerHTML = "Tic Tac Toe is cool";
	//document.write("Tic Tac Toe is cool");
	
	var canvas = document.getElementById("theCanvas");
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = "white";
	ctx.clearRect(0,0,300,300);
	
	ctx.fillStyle = "black";
	
	// Make the board for TicTacToe
	ctx.beginPath();
	
	//Line 1
	ctx.moveTo(0, 100);
	ctx.lineTo(300, 100);
	
	//Line 2
	ctx.moveTo(0, 200);
	ctx.lineTo(300, 200);
	
	//Line 3
	ctx.moveTo(100, 0);
	ctx.lineTo(100, 300);
	
	//Line 4
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 300);
	
	ctx.stroke();
}
