import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"
import * as cwtmap from "./cwtmapengine.js"
import * as cwtmath from "./tools/math/cwtmathtoken.js"


/*
 * Custom Wars Tactics - Game Demo
 */
//let ans = 0;

export const name = "CWTDEMO";

export function init(){
  //let equation = "10 ** 2 + ( ( 10 ** 3 ) / 4.5 ) |^ "
  //ans = cwtmath.evalMathToken(equation)



  cwtmap.init();
  //cwtmap.createMap(30, 20);
  //cwtmap.createNullBorderMap(30, 20);
  //cwtmap.setMapPosition(50, 50);

  //cwtmap.createUnit(0, 0, 0, 10, 3, 0, 1, 0);
  //cwtmap.createUnit(0, 6, 6, 10, 2, 1, 3, 1);
  //cwtmap.createUnit(0, 10, 5, 10, 5, 0, 5, 2);

  //let url = "yummy";
  //let urlFrag = "cool";

  //url += (urlFrag ? "?"+urlFrag : "")
  //console.log("URL", url)

}

export function update(){
  cwtmap.update();

  if (!cwtmap.isMap()){
    cwtmap.createFileMap("cwttestnull.json", ["AW1", "CWT"]);
    cwtmap.createFileMap("cwttestnull.json", ["CWT", "AW1"]);
  }//*/
}

export function render(canvas, ctx){
  cwtmap.render(canvas, ctx);

  //ctx.fillText(ans, 100, 10);
}
