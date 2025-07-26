import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"
import * as cwtmap from "./cwtmapengine.js"

/*
 * Custom Wars Tactics - Game Demo
 */

export const name = "CWTDEMO";

export function init(){
  cwtmap.init();
  //cwtmap.createMap(30, 20);
  cwtmap.createNullBorderMap(30, 20);
  cwtmap.setMapPosition(50, 50);

  cwtmap.createUnit(0, 0, 0, 10, 3, 0, 1, 0);
  cwtmap.createUnit(0, 6, 6, 10, 2, 1, 3, 1);
  cwtmap.createUnit(0, 10, 5, 10, 5, 0, 5, 2);
}

export function update(){
  cwtmap.update();
}

export function render(canvas, ctx){
  cwtmap.render(canvas, ctx);
}
