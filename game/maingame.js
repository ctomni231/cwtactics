import { input, state, loop, view } from "../engine/screenstate.js"
import * as jslix from "../engine/js/jslix.js"
import * as ajax from "../engine/js/ajax.js"

export const name = "CWTMAIN"

export function init(){


}

export function update(){

}

export function render(canvas, ctx){
  ctx.drawImage(jslix.getQuickImage("./image/background/AW1Title.png"), 0, 0, view.sizex, view.sizey);
}
