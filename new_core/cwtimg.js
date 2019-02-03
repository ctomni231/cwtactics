import * as jslix from "./jslix.js"

/*
 * CWT Image
 *
 * Sits on top of JSlix, and adds helper functions for getting images
 */

// Currently, best used for units, but will expand later
export function addColorMap(filename){
  jslix.addColorMap(filename)
}

// The goal, make sure to retrieve an image with the specified Attributes
// filename - the base name (or id) of the image
// map - the index of the palette used to color the image
// color - The army color of this image
// dir - the direction of the image
export function addCWTImage(filename, map, color, dir){

  let imgName = ""+filename+"_"+map+"_"+color+"_"+dir

  if(map >= 0){
    imgName += "_"+map+"_"+color
    jslix.addColorChange(map, color)
  }

  if(dir > 0){
    if(dir == 1) jslix.addFlipX()
    if(dir == 2) jslix.addFlipY()
    imgName += "_"+dir
  }

  jslix.changeReference(imgName)
  jslix.addImage(filename)

  return imgName

}
