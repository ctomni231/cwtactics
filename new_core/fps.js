/* fps.js
 *
 * Class for quickly getting the frames per second
 */

const time = {

  jfps: 0,
  tfps: 0,
  count: 0,
  frame: 0,

  nowTime: 0,
  lastTime: 0,
  diffTime: 0
}

// default lx=4, ly=10
export function display(ctx, lx, ly) {
  time.nowTime = new Date().getTime();
  time.diffTime = time.nowTime - time.lastTime;
  time.tfps = parseInt(1000 / (time.diffTime || 1), 10);
  time.frame += time.diffTime;
  time.count++;
  if(time.frame > 1000){
     time.frame -= 1000;
     if(time.frame > 1000){
       time.frame = 0
     }
     time.jfps = time.count;
     time.count = 0;
  }

  //ctx.fillStyle = '#FFFFFF';
  //ctx.fillRect(0, 0, 100, 10);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('FPS: ' + time.jfps + ' [' + time.tfps + ']', lx, ly);

  time.lastTime = time.nowTime;
}
