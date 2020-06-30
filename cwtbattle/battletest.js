import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"

export const name = "CWTBATTLE"

let basize = 30
let left = null
let leftctx = null
let right = null
let rightctx = null
let opacity = 0.7
let lefthp = 100
let righthp = 100

export function init(){

  // Need to make some overlays (left)
  left = document.getElementById("left");
	if(left == null){
		left = document.createElement("canvas");
		document.body.appendChild(left);
	}
	left.setAttribute("id", "left");
	left.setAttribute("style", "display:none");
  left.setAttribute("width", 256);
  left.setAttribute("height", 320);
  leftctx = left.getContext("2d");
  //leftctx.fillStyle = 'red'
  //leftctx.fillRect(0, 0, 256, 320)

  // Need to make some overlays
  right = document.getElementById("right");
	if(right == null){
		right = document.createElement("canvas");
		document.body.appendChild(right);
	}
	right.setAttribute("id", "right");
	right.setAttribute("style", "display:none");
  right.setAttribute("width", 256);
  right.setAttribute("height", 320);
  rightctx = right.getContext("2d");
  //rightctx.fillStyle = 'blue'
  //rightctx.fillRect(0, 0, 256, 320)

  // The terrain parts
  jslix.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png")

  // The HP Bar stuff
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")

  // The HP gradient stuff
  jslix.addImage("image/cwt_battle/parts/GradientBar.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/parts/GradientBar.png")

}

export function update(){

}

export function render(canvas, ctx){

  // This is to show the battle
  ctx.fillStyle = 'black'
  ctx.fillRect(basize, basize, view.sizex-(basize*2), view.sizey-(basize*2))
  ctx.fillStyle = 'white'
  ctx.fillRect(basize+5, basize+5, view.sizex-((basize+5)*2), view.sizey-((basize+5)*2))

  // This draws the left and right side of the battle animation
  ctx.drawImage(jslix.getImg(0), basize+5, basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))
  ctx.drawImage(jslix.getImg(1), (view.sizex/2), basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))

  // This draw the top HP of the battle animation
  ctx.drawImage(jslix.getImg(2), basize+6, basize+6, (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(3), (view.sizex/2)+1, basize+6, (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-5)

  // Let's try it animated and flashing
  lefthp -= 1
  righthp -= 1
  if(lefthp < 0){
    lefthp = 100
    righthp = 100
  }

  // GLobal Aplha way of making a translucent overlay, trying another way
  ctx.globalAlpha = opacity
  //leftctx.globalAlpha = 1.0
  leftctx.clearRect(0, 0, 256, 320)
  //leftctx.drawImage(jslix.getImg(4), 88, 2, 163, 17)
  leftctx.drawImage(jslix.getImg(5), 88, 2)
  // We'll have to get creative with the clear rect
  for(let i = 0; i < 18; i++){
    leftctx.clearRect(85+i-(righthp*(162/100)), 18-i, 149, 1)
  }

  //rightctx.globalAlpha = 1.0
  rightctx.clearRect(0, 0, 256, 320)
  //rightctx.drawImage(jslix.getImg(5), 5, 2, 163, 17)
  rightctx.drawImage(jslix.getImg(4), 5, 2)




  var tempImg1 = new Image();
  tempImg1.src = left.toDataURL();
  ctx.drawImage(tempImg1, basize+5, basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))
  var tempImg2 = new Image();
  tempImg2.src = right.toDataURL();
  ctx.drawImage(tempImg2, (view.sizex/2), basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))

  ctx.globalAlpha = 1.0


  // Draws the center divider
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  ctx.moveTo(view.sizex/2, basize)
  ctx.lineTo(view.sizex/2, view.sizey-basize)
  ctx.stroke()






}
