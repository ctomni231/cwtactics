import { loop, view, input } from "../screenstate.js"

// This is a very simple debugging system showing the fps in the window
// This is a trait class

let jfps = 0
let tfps = 0
let count = 0
let frame = 0
let lastTime = new Date().getTime();

let showfps = 1;
let action = false;

export function update(){
  if (input.DEBUG_A) {
    action = true
  }else if(action){
    action = false
    showfps *= -1;
  }
}

export function render(canvas, ctx){
  // Keeps track of the FPS
  let nowTime = new Date().getTime();
  let diffTime = nowTime - lastTime;
  tfps = parseInt(1000 / (diffTime || 1), 10);
  frame += diffTime;
  count++;
  if(frame > 1000){
	   frame -= 1000;
	   jfps = count;
	   count = 0;
  }

  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  if(showfps > 0){
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 3, 11);
    ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 3, 21);
    ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 3, 31);
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 5, 11);
    ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 5, 21);
    ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 5, 31);
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 3, 9);
    ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 3, 19);
    ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 3, 29);
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 5, 9);
    ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 5, 19);
    ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 5, 29);
  }
  ctx.fillStyle = '#000000';
  if(showfps > 0){
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 4, 10);
    ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 4, 20);
    ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 4, 30);
  }

  lastTime = nowTime;
}
