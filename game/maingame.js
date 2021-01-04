import { input, state, loop, view } from "../engine/screenstate.js"
import * as jslix from "../engine/js/jslix.js"
import * as ajax from "../engine/js/ajax.js"

export const name = "CWTMAIN"

export function init(){
  //jslix.createGIFImage("./image/background/AWDoRBattle.gif")
}

export function update(){

}

export function render(canvas, ctx){
  //ctx.drawImage(jslix.getGIFImg(), 0, 0, view.sizex, view.sizey);
  ctx.drawImage(jslix.getQuickImage("./image/background/AW1Map.png"), 0, 0, view.sizex, view.sizey);
}
