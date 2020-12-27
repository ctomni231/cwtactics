import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"

// Playground for testing out the features in the code

export function init(){
  jslix.addImage("./cwtargetapp.png")
}

export function update(){

}

export function render(canvas, ctx){
  ctx.drawImage(jslix.getImg(0), 10, 10);
  jslix.placeImg(ctx, 0, 20, 20);
}
