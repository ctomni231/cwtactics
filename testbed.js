import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"
import * as ajax from "./engine/js/ajax.js"

// Playground for testing out the features in the code
var print = true;
var objt;

export function init(){
  jslix.addImage("./cwtargetapp.png");
  jslix.addImage("./image/background/AW2Sturm.png");
  jslix.addImage("./image/menu/BasicCombine.png");


  ajax.request("./credits.json");

  jslix.addTextInfo(2, 9, 5, 0, jslix.jslix.ASCII_COMBINE)

  // No longer works well while pre-loading (missing letters)
  jslix.addTextImage(2, "INCREDIBLE 01234");
}

export function update(){

  if(print && ajax.isRefReady("./credits.json")){
    objt = ajax.getRefJson("./credits.json")
    console.log(ajax.generateList(objt));
    var text = Object.keys(objt)[0];
    console.log(text);

    // Works really well on the fly loading
    //jslix.addTextImage(2, "INCREDIBLE 01234");
    jslix.addTextImage(2, text);

    print = false;
  }
}

export function render(canvas, ctx){
  ctx.drawImage(jslix.getImg(3), 10, 50);
  ctx.drawImage(jslix.getImg(4), 10, 70);
  
  ctx.drawImage(jslix.getImg(0), 10, 110);
  jslix.placeImg(ctx, 0, 20, 120);
  jslix.drawImg(ctx, 0, 30, 130, -jslix.getX(0), -jslix.getY(0));
  jslix.placeCropImg(ctx, 0, 40, 140, 100, -20);
  jslix.drawCropImg(ctx, 0, 50, 150, -jslix.getX(0), -jslix.getY(0), -100, 20);
  jslix.placeCutImg(ctx, 1, 60, 160, 0, 0, jslix.getX(0), jslix.getY(0));
  jslix.drawCutImg(ctx, 2, 70, 170, jslix.getX(0), -jslix.getY(0), 0, 0, 15, 17);
}
