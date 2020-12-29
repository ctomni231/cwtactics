import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"
import * as ajax from "./engine/js/ajax.js"

// Playground for testing out the features in the code
let print = true;

export function init(){
  jslix.addImage("./cwtargetapp.png");
  jslix.addImage("./image/background/AW2Sturm.png");
  jslix.addImage("./image/menu/BasicAlpha.png");

  ajax.request("./credits.json");
}

export function update(){

  if(print && ajax.isRefReady("./credits.json")){
    console.log(ajax.generateList(ajax.getRefJson("./credits.json")));
    print = false;
  }
}

export function render(canvas, ctx){
  ctx.drawImage(jslix.getImg(0), 10, 10);
  jslix.placeImg(ctx, 0, 20, 20);
  jslix.drawImg(ctx, 0, 30, 30, -jslix.getX(0), -jslix.getY(0));
  jslix.placeCropImg(ctx, 0, 40, 40, 100, -20);
  jslix.drawCropImg(ctx, 0, 50, 50, -jslix.getX(0), -jslix.getY(0), -100, 20);
  jslix.placeCutImg(ctx, 1, 60, 60, 0, 0, jslix.getX(0), jslix.getY(0));
  jslix.drawCutImg(ctx, 2, 70, 70, jslix.getX(0), -jslix.getY(0), 0, 0, 15, 17);
}
