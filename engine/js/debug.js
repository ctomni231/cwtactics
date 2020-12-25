import { loop, view, input } from "../screenstate.js"

// This is a very simple debugging system showing the fps in the window
// This is a trait class

let jfps = 0
let tfps = 0
let count = 0
let frame = 0
let lastTime = new Date().getTime();

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

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 100, 40);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 4, 10);
  ctx.fillText('SCR: (' + view.sizex + ',' + view.sizey + ')', 4, 20);
  ctx.fillText('LOC: (' + input.MOUSEX + ',' + input.MOUSEY + ')', 4, 30);

  lastTime = nowTime;
}
