import { input, state, loop, view } from "./engine/screenstate.js"
import * as jslix from "./engine/js/jslix.js"

export const name = "CWTBATTLE"

let action = false
let atrig = 0

let basize = 30
let baropacity = 1.0
let leftpix = -1
let lefthp = 100
let rightpix = -1
let righthp = 100
let baw2 = true
let law2 = true
let raw2 = true
let ltop = true
let rtop = true
let lpile = ""
let rpile = ""
let lstar = 4
let lmult = 2
let rstar = 4
let rmult = 2
let lrank = 0
let rrank = 0
let maxrank = 4

//let hex = Buffer.from(uint8).toString('hex');
let updatePixels = false
let lpixelColors = ['#F8C880', '#F89870', '#F85800', '#F82800', '#E00008', '#980038']
let rpixelColors = ['#F8C880', '#F89870', '#F85800', '#F82800', '#E00008', '#980038']


export function init(){

  // Add the color map - colors of the HP Bar
  jslix.addColorMap("image/UnitBaseColors.png")

  // The numerals
  for(let i = 0; i < 10; i++){
    jslix.addImage("image/cwt_battle/parts/"+i+".png")
  }

  // The terrain parts
  jslix.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/terrain(C)/CWT_PLIN.png")

  // The HP Bar stuff
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")
  jslix.addFlipY()
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")
  jslix.addFlipY()
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/parts/HPBarMini.png")

  // The Tiny Def
  jslix.addImage("image/cwt_battle/parts/Def.png")
  // The stars
  jslix.addImage("image/cwt_battle/parts/StarBig.png")
  jslix.addImage("image/cwt_battle/parts/StarOver.png")

  // The Dossier stuff
  jslix.addImage("image/cwt_battle/mugs/faction/normal/OS_INFT.png")
  jslix.addFlipX()
  jslix.addImage("image/cwt_battle/mugs/faction/normal/OS_INFT.png")

  // The Ranking stuff
  jslix.addImage("image/symbol/guard.png")
  jslix.addImage("image/symbol/elite.png")
  jslix.addImage("image/symbol/veteran.png")
  jslix.addImage("image/symbol/ace.png")

  // Working on the units
}

export function update(){

  // This handles the action presses
  if (input.ACTION) {
    action = true
    atrig += 1;
  }else if(action){
    action = false
    atrig = 0;
  }

  // Grab the colors from the thing the moment they are available
  if(updatePixels){
    if(jslix.jslix !== undefined){
      if(jslix.jslix.imgMap.length > 0){
        if(jslix.jslix.mapX[0] > 0){

          let ltmpArr = []
          let rtmpArr = []
          // Update the pixels right here
          for(let i = 0; i < jslix.jslix.imgMap[0].length; i++){//i+=4
            //console.log(toHex(jslix.jslix.imgMap[0][i])+" "+jslix.jslix.imgMap[0][i])
            if(leftpix >= 0){
              if(i >= jslix.jslix.mapX[0]*4*leftpix && i < jslix.jslix.mapX[0]*4*(leftpix+1)){
                if(i%4==0)
                  lpile = "#"+toHex(jslix.jslix.imgMap[0][i])
                else if(i%4==3)
                  ltmpArr.push(lpile)
                else
                  lpile += toHex(jslix.jslix.imgMap[0][i])
              }
            }
            if(rightpix >= 0){
              if(i >= jslix.jslix.mapX[0]*4*rightpix && i < jslix.jslix.mapX[0]*4*(rightpix+1)){
                if(i%4==0)
                  rpile = "#"+toHex(jslix.jslix.imgMap[0][i])
                else if(i%4==3)
                  rtmpArr.push(rpile)
                else
                  rpile += toHex(jslix.jslix.imgMap[0][i])
              }
            }
          }

          // Last check to make sure things are legal
          if(ltmpArr.length > 0)
            lpixelColors = ltmpArr
          if(rtmpArr.length > 0)
            rpixelColors = rtmpArr
          updatePixels = false
        }
      }
    }
  }

  // Let's try it animated and flashing
  lefthp -= 1
  righthp -= 1
  if(lefthp < 0){
    lefthp = 100
    righthp = 100

    // Flip the bars
    law2 = !law2
    raw2 = !raw2

    // Add to the rank if law2 is true
    if(law2){
      lrank += 1
      rrank += 1

      if(lrank > maxrank){
        lrank = 0
        rrank = 0
      }
    }
  }
  //lefthp=100
  //righthp=100

  if(atrig == 1){
    updatePixels = true
    //lefthp -= 5
    //righthp -= 5
    if(jslix.jslix !== undefined){
      if(jslix.jslix.imgMap.length > 0){
        leftpix++;
        rightpix++;
        if(leftpix >= jslix.jslix.mapY[0]){
          leftpix = 0
          rightpix = 0

          // Switch the orientation
          baw2 = !baw2
        }
      }
    }
  }
}

export function render(canvas, ctx){

  // This is to show the battle
  ctx.fillStyle = 'black'
  ctx.fillRect(basize, basize, view.sizex-(basize*2), view.sizey-(basize*2))
  ctx.fillStyle = 'white'
  ctx.fillRect(basize+5, basize+5, view.sizex-((basize+5)*2), view.sizey-((basize+5)*2))

  // This is for the side by side battle animation
  if(baw2)
    horibattle(ctx)
  else
    vertbattle(ctx)

}

function vertbattle(ctx){
  // This draws the top and bottom of the battle animation
  ctx.drawImage(jslix.getImg(10), basize+5, basize+5, view.sizex-((basize+5)*2), (view.sizey/2)-(basize+5))
  ctx.drawImage(jslix.getImg(11), basize+5, (view.sizey/2), view.sizex-((basize+5)*2), (view.sizey/2)-(basize+5))

  // This draws the top HP of the battle animation
  ctx.drawImage(jslix.getImg(12), basize+6, basize+7, (4*view.sizex/5)-((basize+5))-2, (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(13), view.sizex-(4*view.sizex/5), (view.sizey/2)+2, (4*view.sizex/5)-((basize+5)), (9*view.sizey/160)-5)

  // This draws the bottom HP of the battle animation
  ctx.drawImage(jslix.getImg(14), basize+6, (view.sizey/2)-(9*view.sizey/160)+2, (4*view.sizex/5)-((basize+5))-2, (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(15), view.sizex-(4*view.sizex/5), (view.sizey)-(basize)-(9*view.sizey/160)-2, (4*view.sizex/5)-((basize+5)), (9*view.sizey/160)-5)

  // Def part
  // Top
  ctx.drawImage(jslix.getImg(16), basize+6+(view.sizex/7), basize+7, (4*view.sizex/5)*(25/254), (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(16), (view.sizex)-(basize+6)-(view.sizex/7)-((4*view.sizex/5)*(25/254)), (view.sizey/2)+2, (4*view.sizex/5)*(25/254), (9*view.sizey/160)-5)
  // Bottom
  ctx.drawImage(jslix.getImg(16), basize+6+(view.sizex/7), (view.sizey/2)-(9*view.sizey/160)+2, (4*view.sizex/5)*(25/254), (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(16), (view.sizex)-(basize+6)-(view.sizex/7)-((4*view.sizex/5)*(25/254)), (view.sizey)-(basize)-(9*view.sizey/160)-2, (4*view.sizex/5)*(25/254), (9*view.sizey/160)-5)

  // Rank Part
  if(lrank > 0){
    ctx.drawImage(jslix.getImg(20+lrank), (4*view.sizex/5)*(245/254), (9*view.sizey/160)*(9/18)+basize, (4*view.sizex/5)*(10/254), (9*view.sizey/160)*(10/18))
    ctx.drawImage(jslix.getImg(20+lrank), (4*view.sizex/5)*(245/254), (view.sizey/2)-(9*view.sizey/160), (4*view.sizex/5)*(10/254), (9*view.sizey/160)*(10/18))
  }
  if(rrank > 0){
    ctx.drawImage(jslix.getImg(20+rrank), (view.sizex/5)+1, (view.sizey/2)+(9*view.sizey/160)*(9/18)-4, (4*view.sizex/5)*(10/254), (9*view.sizey/160)*(10/18))
    ctx.drawImage(jslix.getImg(20+rrank), (view.sizex/5), (view.sizey)-basize-(9*view.sizey/160)*((9/18)+(10/18))-4, (4*view.sizex/5)*(10/254), (9*view.sizey/160)*(10/18))
  }


  // Left Star part
  for(let i = 0; i < lstar; i++){
    for(let j = 0; j < lmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(17),
        basize+5+(view.sizex/7)+((view.sizex*i)/(25+(lstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(lstar/6)*10)),
        view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(17),
          basize+5+(view.sizex/7)+((view.sizex*i)/(25+(lstar/6)*10)),
          (view.sizey/2)-(9*view.sizey/160)+2-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(lstar/6)*10)),
          view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
    }
  }

  // Over star
  for(let i = 0; i < lstar; i++){
    for(let j = 0; j < lmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(18),
        basize+5+(view.sizex/7)+((view.sizex*i)/(25+(lstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(lstar/6)*10)),
        view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(18),
          basize+5+(view.sizex/7)+((view.sizex*i)/(25+(lstar/6)*10)),
          (view.sizey/2)-(9*view.sizey/160)+2-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(lstar/6)*10)),
          view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
    }
  }

  // Right Star part
  for(let i = 0; i < rstar; i++){
    for(let j = 0; j < rmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(17),
        view.sizex-(basize+6)-(view.sizex/7)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
        (view.sizey/2)+(9*view.sizey/160)-5+((view.sizey*j)/(25+(rstar/6)*10)),
        view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(17),
          view.sizex-(basize+6)-(view.sizex/7)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(rstar/6)*10)),
          view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
    }
  }

  // Right Over
  for(let i = 0; i < rstar; i++){
    for(let j = 0; j < rmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(18),
        view.sizex-(basize+6)-(view.sizex/7)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
        (view.sizey/2)+(9*view.sizey/160)-5+((view.sizey*j)/(25+(rstar/6)*10)),
        view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(18),
          view.sizex-(basize+6)-(view.sizex/7)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(rstar/6)*10)),
          view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
    }
  }

  // Dossier image
  // Top
  ctx.fillStyle = lpixelColors[1]
  ctx.fillRect(basize+6, basize+7, view.sizex/7, view.sizey/9)
  ctx.drawImage(jslix.getImg(19), basize+7, basize+7, view.sizex/7, view.sizey/9)
  // Bottom
  ctx.fillStyle = lpixelColors[1]
  ctx.fillRect(basize+6, (view.sizey/2)-(3)-view.sizey/9, view.sizex/7, view.sizey/9)
  ctx.drawImage(jslix.getImg(19), basize+7, (view.sizey/2)-(3)-view.sizey/9, view.sizex/7, view.sizey/9)

  // Top
  ctx.fillStyle = rpixelColors[1]
  ctx.fillRect(view.sizex-(basize+6)-(view.sizex/7), (view.sizey/2)+2, view.sizex/7, view.sizey/9)
  ctx.drawImage(jslix.getImg(20), view.sizex-(basize+7)-(view.sizex/7), (view.sizey/2)+2, view.sizex/7, view.sizey/9)
  // Bottom
  ctx.fillStyle = rpixelColors[1]
  ctx.fillRect(view.sizex-(basize+6)-(view.sizex/7), (view.sizey)-(basize+7)-view.sizey/9, view.sizex/7, view.sizey/9)
  ctx.drawImage(jslix.getImg(20), view.sizex-(basize+7)-(view.sizex/7), (view.sizey)-(basize+7)-view.sizey/9, view.sizex/7, view.sizey/9)

  ctx.globalAlpha = 0.8
  // Let's gather the numbers we need to do this thing
  let lyrange = (9*view.sizey/160)-5
  let tempnum = 0
  for(let i = 0; i < lyrange; i++){
    // We'll replicate the two types of bars here

    tempnum = (i*16)/lyrange

    if(law2){
      // AW2
      if(tempnum < 7)
        ctx.strokeStyle = lpixelColors[0]
      else
        ctx.strokeStyle = lpixelColors[5]

      if(tempnum > 2 && tempnum < 14){
        if(tempnum < 3 || tempnum > 13){
          // The top bar
          ctx.beginPath()
          ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
          ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
          ctx.stroke()

          // The bottom bar
          ctx.beginPath()
          ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                      (view.sizey/2)-(3+i))
          ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                      (view.sizey/2)-(3+i))
          ctx.stroke()
        }else{
          for(let j = 0; j < 5; j++){
            ctx.strokeStyle = lpixelColors[j]
            let value = lefthp-(j*20)
            if(value <= 0)
              break
            else if(value > 20)
              value = 20

            // The top bar
            ctx.beginPath()
            ctx.moveTo((basize+6)+((87+((5-j)*30)+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
            ctx.lineTo((basize+6)+((87+((4-j)*30)+((20-value)*(30/20))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
            ctx.stroke()

            // The bottom bar
            ctx.beginPath()
            ctx.moveTo((basize+6)+((87+((5-j)*30)+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                        (view.sizey/2)-(3+i))
            ctx.lineTo((basize+6)+((87+((4-j)*30)+((20-value)*(30/20))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                        (view.sizey/2)-(3+i))
            ctx.stroke()
          }
        }
      }
    }else{
      // AWDOR
      if(tempnum <= 4)
        ctx.strokeStyle = lpixelColors[5]
      else if(tempnum <= 6)
        ctx.strokeStyle = lpixelColors[4]
      else if(tempnum <= 8)
        ctx.strokeStyle = lpixelColors[3]
      else if(tempnum <= 10)
        ctx.strokeStyle = lpixelColors[2]
      else if(tempnum <= 12)
        ctx.strokeStyle = lpixelColors[1]
      else
        ctx.strokeStyle = lpixelColors[0]

      if(tempnum > 2 && tempnum < 14){
        // The top bar
        ctx.beginPath()
        ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
        ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254), basize+6+i)
        ctx.stroke()

        // The bottom bar
        ctx.beginPath()
        ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                    (view.sizey/2)-(3+i))
        ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((4*view.sizex/5)-(basize+5)-2)/254),
                    (view.sizey/2)-(3+i))
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 0.8
  tempnum = 0
  for(let i = 0; i < lyrange; i++){
    // We'll replicate the two types of bars here

    tempnum = (i*16)/lyrange

    if(raw2){
      // AW2
      if(tempnum < 7)
        ctx.strokeStyle = rpixelColors[0]
      else
        ctx.strokeStyle = rpixelColors[5]

      if(tempnum > 2 && tempnum < 14){
        if(tempnum < 3 || tempnum > 13){

          // The top bar
          ctx.beginPath()
          ctx.moveTo((view.sizex/5)+(171-((100-righthp)*(150/100))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                      (view.sizey/2)+2+i)
          ctx.lineTo((view.sizex/5)+((21-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254),
                      (view.sizey/2)+2+i)
          ctx.stroke()

          // The bottom bar
          ctx.beginPath()
          ctx.moveTo((view.sizex/5)+(170-((100-righthp)*(150/100))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                      (view.sizey)-(basize+6+i))
          ctx.lineTo((view.sizex/5)+(21-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                      (view.sizey)-(basize+6+i))
          ctx.stroke()
        }else{
          for(let j = 0; j < 5; j++){
            ctx.strokeStyle = rpixelColors[j]
            let value = righthp-(j*20)
            if(value <= 0)
              break
            else if(value > 20)
              value = 20
            // The top bar
            ctx.beginPath()
            ctx.moveTo((view.sizex/5)+((171-((5-j)*30)-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254),
                        (view.sizey/2)+2+i)
            ctx.lineTo((view.sizex/5)+((171-((4-j)*30)-((20-value)*(30/20))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254),
                        (view.sizey/2)+2+i)
            ctx.stroke()

            // The bottom bar
            ctx.beginPath()
            ctx.moveTo((view.sizex/5)+((170-((5-j)*30)-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.lineTo((view.sizex/5)+((170-((4-j)*30)-((20-value)*(30/20))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.stroke()
          }
        }
      }
    }else{
      // AWDOR
      if(tempnum <= 4)
        ctx.strokeStyle = rpixelColors[5]
      else if(tempnum <= 6)
        ctx.strokeStyle = rpixelColors[4]
      else if(tempnum <= 8)
        ctx.strokeStyle = rpixelColors[3]
      else if(tempnum <= 10)
        ctx.strokeStyle = rpixelColors[2]
      else if(tempnum <= 12)
        ctx.strokeStyle = rpixelColors[1]
      else
        ctx.strokeStyle = rpixelColors[0]

      if(tempnum > 2 && tempnum < 14){
        // The top bar
        ctx.beginPath()
        ctx.moveTo((view.sizex/5)+(171-((100-righthp)*(150/100))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                    (view.sizey/2)+2+i)
        ctx.lineTo((view.sizex/5)+(21-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                    (view.sizey/2)+2+i)
        ctx.stroke()

        // The bottom bar
        ctx.beginPath()
        ctx.moveTo((view.sizex/5)+(170-((100-righthp)*(150/100))-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                    (view.sizey)-(basize+6+i))
        ctx.lineTo((view.sizex/5)+(21-(16-tempnum)-2)*((4*view.sizex/5)-(basize)-2)/254,
                    (view.sizey)-(basize+6+i))
        ctx.stroke()
      }
    }
  }

  // HP numbers
  ctx.globalAlpha = 1.0

  // This draw the top HP of the battle animation
  ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), view.sizex-(basize+5)-view.sizex/15-2, (basize+7), view.sizex/15, view.sizey/9)
  if(lefthp > 90)
    ctx.drawImage(jslix.getImg(0+1), view.sizex-(basize+5)-((view.sizex/15)*2), (basize+7), view.sizex/15, view.sizey/9)

  if(righthp > 90){
    ctx.drawImage(jslix.getImg(0+1), (basize+7)-(view.sizex/30)+4, (view.sizey/2)+2, view.sizex/15, view.sizey/9)
    ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+7)+(view.sizex/(15*2))+2, (view.sizey/2)+2, view.sizex/15, view.sizey/9)
  }else{
    ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+7), (view.sizey/2)+2, view.sizex/15, view.sizey/9)
  }

  // This draw the bottom HP of the battle animation
  ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), view.sizex-(basize+5)-view.sizex/15-2, view.sizey/2-(view.sizey/9)-2, view.sizex/15, view.sizey/9)
  if(lefthp > 90)
    ctx.drawImage(jslix.getImg(0+1), view.sizex-(basize+5)-((view.sizex/15)*2), view.sizey/2-(view.sizey/9)-2, view.sizex/15, view.sizey/9)

  if(righthp > 90){
    ctx.drawImage(jslix.getImg(0+1), (basize+7)-(view.sizex/30)+2, (view.sizey)-(basize+7)-(view.sizey/9), view.sizex/15, view.sizey/9)
    ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+7)+(view.sizex/15)-(view.sizex/30)+2, (view.sizey)-(basize+7)-(view.sizey/9), view.sizex/15, view.sizey/9)
  }else{
    ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+7), (view.sizey)-(basize+7)-(view.sizey/9), view.sizex/15, view.sizey/9)
  }

  // Draws the center divider
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  ctx.moveTo(basize, view.sizey/2)
  ctx.lineTo(view.sizex-basize, view.sizey/2)
  ctx.stroke()

}

function horibattle(ctx){
  // This draws the left and right side of the battle animation
  ctx.drawImage(jslix.getImg(10), basize+5, basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))
  ctx.drawImage(jslix.getImg(11), (view.sizex/2), basize+5, (view.sizex/2)-(basize+5), view.sizey-((basize+5)*2))

  // This draw the top HP of the battle animation
  ctx.drawImage(jslix.getImg(12), basize+6, basize+6, (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(13), (view.sizex/2)+1, basize+6, (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-5)

  // This draws the bottom HP of the battle animation
  ctx.drawImage(jslix.getImg(14), basize+6, (view.sizey)-(basize)-(9*view.sizey/160), (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-6)
  ctx.drawImage(jslix.getImg(15), (view.sizex/2)+1, (view.sizey)-(basize)-(9*view.sizey/160), (view.sizex/2)-(basize+5)-2, (9*view.sizey/160)-6)

  // Def part
  // Top
  ctx.drawImage(jslix.getImg(16), basize+6+(view.sizex/12.5), basize+6, (view.sizex/2)*(25/254), (9*view.sizey/160)-5)
  ctx.drawImage(jslix.getImg(16), view.sizex-(basize+6)-(view.sizex/12.5)-((view.sizex/2)*(25/254)), basize+6, (view.sizex/2)*(25/254), (9*view.sizey/160)-5)
  // Bottom
  ctx.drawImage(jslix.getImg(16), basize+6+(view.sizex/12.5), (view.sizey)-(basize+6)-(9*view.sizey/160)+6, (view.sizex/2)*(25/254), (9*view.sizey/160)-6)
  ctx.drawImage(jslix.getImg(16), view.sizex-(basize+6)-(view.sizex/12.5)-((view.sizex/2)*(25/254)), (view.sizey)-(basize+6)-(9*view.sizey/160)+6,
                                  (view.sizex/2)*(25/254), (9*view.sizey/160)-6)

  // Rank Part
  if(lrank > 0){
    ctx.drawImage(jslix.getImg(20+lrank), (view.sizex/2)*(244/254), (9*view.sizey/160)*(9/18)+basize, (view.sizex/2)*(10/254), (9*view.sizey/160)*(10/18))
    ctx.drawImage(jslix.getImg(20+lrank), (view.sizex/2)*(244/254), (view.sizey)-basize-(9*view.sizey/160), (view.sizex/2)*(10/254), (9*view.sizey/160)*(10/18))
  }
  if(rrank > 0){
    ctx.drawImage(jslix.getImg(20+rrank), (view.sizex/2), (9*view.sizey/160)*(9/18)+basize, (view.sizex/2)*(10/254), (9*view.sizey/160)*(10/18))
    ctx.drawImage(jslix.getImg(20+rrank), (view.sizex/2), (view.sizey)-basize-(9*view.sizey/160), (view.sizex/2)*(10/254), (9*view.sizey/160)*(10/18))
  }

  // Left Star part
  for(let i = 0; i < lstar; i++){
    for(let j = 0; j < lmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(17),
        basize+6+(view.sizex/13)+((view.sizex*i)/(25+(lstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(lstar/6)*10)),
        view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(17),
          basize+6+(view.sizex/13)+((view.sizex*i)/(25+(lstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(lstar/6)*10)),
          view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
    }
  }

  // Over star
  for(let i = 0; i < lstar; i++){
    for(let j = 0; j < lmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(18),
        basize+6+(view.sizex/13)+((view.sizex*i)/(25+(lstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(lstar/6)*10)),
        view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(18),
          basize+6+(view.sizex/13)+((view.sizex*i)/(25+(lstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(lstar/6)*10)),
          view.sizex/(20+((lstar/6)*10)), view.sizey/(20+((lstar/6)*10)))
    }
  }

  // Right Star part
  for(let i = 0; i < rstar; i++){
    for(let j = 0; j < rmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(17),
        view.sizex-(basize+6)-(view.sizex/13)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(rstar/6)*10)),
        view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(17),
          view.sizex-(basize+6)-(view.sizex/13)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(rstar/6)*10)),
          view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
    }
  }

  // Right Over
  for(let i = 0; i < rstar; i++){
    for(let j = 0; j < rmult; j++){
      // Top
      ctx.drawImage(jslix.getImg(18),
        view.sizex-(basize+6)-(view.sizex/13)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
        basize+6+(9*view.sizey/160)-5+((view.sizey*j)/(25+(rstar/6)*10)),
        view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
      // Bottom
      ctx.drawImage(jslix.getImg(18),
          view.sizex-(basize+6)-(view.sizex/13)-view.sizex/(20+((rstar/6)*10))-((view.sizex*i)/(25+(rstar/6)*10)),
          (view.sizey)-(basize+6)-(9*view.sizey/160)+6-(view.sizey/(20+((rstar/6)*10)))-((view.sizey*j)/(25+(rstar/6)*10)),
          view.sizex/(20+((rstar/6)*10)), view.sizey/(20+((rstar/6)*10)))
    }
  }

  // Dossier image
  // Top
  ctx.fillStyle = lpixelColors[1]
  ctx.fillRect(basize+7, basize+7, view.sizex/13, view.sizey/6)
  ctx.drawImage(jslix.getImg(19), basize+7, basize+7, view.sizex/13, view.sizey/6)
  // Bottom
  ctx.fillStyle = lpixelColors[1]
  ctx.fillRect(basize+7, (view.sizey)-(basize+7)-view.sizey/6, view.sizex/13, view.sizey/6)
  ctx.drawImage(jslix.getImg(19), basize+7, (view.sizey)-(basize+7)-view.sizey/6, view.sizex/13, view.sizey/6)

  // Top
  ctx.fillStyle = rpixelColors[1]
  ctx.fillRect(view.sizex-(basize+7)-(view.sizex/13), basize+7, view.sizex/13, view.sizey/6)
  ctx.drawImage(jslix.getImg(20), view.sizex-(basize+7)-(view.sizex/13), basize+7, view.sizex/13, view.sizey/6)
  // Bottom
  ctx.fillStyle = rpixelColors[1]
  ctx.fillRect(view.sizex-(basize+7)-(view.sizex/13), (view.sizey)-(basize+7)-view.sizey/6, view.sizex/13, view.sizey/6)
  ctx.drawImage(jslix.getImg(20), view.sizex-(basize+7)-(view.sizex/13), (view.sizey)-(basize+7)-view.sizey/6, view.sizex/13, view.sizey/6)

  //ctx.globalAlpha = 0.8
  // Let's gather the numbers we need to do this thing
  let lyrange = (9*view.sizey/160)-5
  let tempnum = 0
  for(let i = 0; i < lyrange; i++){
    // We'll replicate the two types of bars here

    tempnum = (i*16)/lyrange

    if(law2){
      // AW2
      if(tempnum < 7)
        ctx.strokeStyle = lpixelColors[0]
      else
        ctx.strokeStyle = lpixelColors[5]

      if(tempnum > 2 && tempnum < 14){
        if(tempnum < 3 || tempnum > 13){
          // The top bar
          ctx.beginPath()
          ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
          ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
          ctx.stroke()

          // The bottom bar
          ctx.beginPath()
          ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                      (view.sizey)-(basize+6+i))
          ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                      (view.sizey)-(basize+6+i))
          ctx.stroke()
        }else{
          for(let j = 0; j < 5; j++){
            ctx.strokeStyle = lpixelColors[j]
            let value = lefthp-(j*20)
            if(value <= 0)
              break
            else if(value > 20)
              value = 20
            // The top bar
            ctx.beginPath()
            ctx.moveTo((basize+6)+((87+((5-j)*30)+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
            ctx.lineTo((basize+6)+((87+((4-j)*30)+((20-value)*(30/20))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
            ctx.stroke()

            // The bottom bar
            ctx.beginPath()
            ctx.moveTo((basize+6)+((87+((5-j)*30)+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.lineTo((basize+6)+((87+((4-j)*30)+((20-value)*(30/20))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.stroke()
          }
        }
      }
    }else{
      // AWDOR
      if(tempnum <= 4)
        ctx.strokeStyle = lpixelColors[5]
      else if(tempnum <= 6)
        ctx.strokeStyle = lpixelColors[4]
      else if(tempnum <= 8)
        ctx.strokeStyle = lpixelColors[3]
      else if(tempnum <= 10)
        ctx.strokeStyle = lpixelColors[2]
      else if(tempnum <= 12)
        ctx.strokeStyle = lpixelColors[1]
      else
        ctx.strokeStyle = lpixelColors[0]

      if(tempnum > 2 && tempnum < 14){
        // The top bar
        ctx.beginPath()
        ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
        ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
        ctx.stroke()

        // The bottom bar
        ctx.beginPath()
        ctx.moveTo((basize+6)+((87+((100-lefthp)*(150/100))+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                    (view.sizey)-(basize+6+i))
        ctx.lineTo((basize+6)+((237+(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                    (view.sizey)-(basize+6+i))
        ctx.stroke()
      }
    }
  }

  ctx.globalAlpha = 1.0
  tempnum = 0
  for(let i = 0; i < lyrange; i++){
    // We'll replicate the two types of bars here

    tempnum = (i*16)/lyrange

    if(raw2){
      // AW2
      if(tempnum < 7)
        ctx.strokeStyle = rpixelColors[0]
      else
        ctx.strokeStyle = rpixelColors[5]

      if(tempnum > 2 && tempnum < 14){
        if(tempnum < 3 || tempnum > 13){
          // The top bar
          ctx.beginPath()
          ctx.moveTo(((view.sizex/2)+1)+((171-((100-righthp)*(150/100))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
          ctx.lineTo(((view.sizex/2)+1)+((21-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
          ctx.stroke()

          // The bottom bar
          ctx.beginPath()
          ctx.moveTo(((view.sizex/2)+1)+((171-((100-righthp)*(150/100))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                      (view.sizey)-(basize+6+i))
          ctx.lineTo(((view.sizex/2)+1)+((21-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                      (view.sizey)-(basize+6+i))
          ctx.stroke()
        }else{
          for(let j = 0; j < 5; j++){
            ctx.strokeStyle = rpixelColors[j]
            let value = righthp-(j*20)
            if(value <= 0)
              break
            else if(value > 20)
              value = 20
            // The top bar
            ctx.beginPath()
            ctx.moveTo(((view.sizex/2)+1)+((171-((5-j)*30)-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
            ctx.lineTo(((view.sizex/2)+1)+((171-((4-j)*30)-((20-value)*(30/20))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
            ctx.stroke()

            // The bottom bar
            ctx.beginPath()
            ctx.moveTo(((view.sizex/2)+1)+((171-((5-j)*30)-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.lineTo(((view.sizex/2)+1)+((171-((4-j)*30)-((20-value)*(30/20))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                        (view.sizey)-(basize+6+i))
            ctx.stroke()
          }
        }

      }
    }else{
      // AWDOR
      if(tempnum <= 4)
        ctx.strokeStyle = rpixelColors[5]
      else if(tempnum <= 6)
        ctx.strokeStyle = rpixelColors[4]
      else if(tempnum <= 8)
        ctx.strokeStyle = rpixelColors[3]
      else if(tempnum <= 10)
        ctx.strokeStyle = rpixelColors[2]
      else if(tempnum <= 12)
        ctx.strokeStyle = rpixelColors[1]
      else
        ctx.strokeStyle = rpixelColors[0]

      if(tempnum > 2 && tempnum < 14){
        // The top bar
        ctx.beginPath()
        ctx.moveTo(((view.sizex/2)+1)+((171-((100-righthp)*(150/100))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
        ctx.lineTo(((view.sizex/2)+1)+((21-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254), basize+6+i)
        ctx.stroke()

        // The bottom bar
        ctx.beginPath()
        ctx.moveTo(((view.sizex/2)+1)+((171-((100-righthp)*(150/100))-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                    (view.sizey)-(basize+6+i))
        ctx.lineTo(((view.sizex/2)+1)+((21-(16-tempnum)-2)*((view.sizex/2)-(basize+5)-2)/254),
                    (view.sizey)-(basize+6+i))
        ctx.stroke()
      }
    }
  }

  // HP numbers

  // This draw the top HP of the battle animation
  ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+5)+(206*((view.sizex/2)-(basize+5)-2)/256), (basize+6+lyrange+9), view.sizex/15, view.sizey/8)
  if(lefthp > 90)
    ctx.drawImage(jslix.getImg(0+1), (basize+5)+(209*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (basize+6+lyrange+9), view.sizex/15, view.sizey/8)

  if(righthp > 90){
    ctx.drawImage(jslix.getImg(0+(Math.ceil(righthp/10)%10)), ((view.sizex/2)+1)+(32*((view.sizex/2)-(basize+5)-2)/256), (basize+6+lyrange+9), view.sizex/15, view.sizey/8)
    ctx.drawImage(jslix.getImg(0+1), ((view.sizex/2)+1)+(35*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (basize+6+lyrange+9), view.sizex/15, view.sizey/8)
  }else{
    ctx.drawImage(jslix.getImg(0+(Math.ceil(righthp/10)%10)), ((view.sizex/2)+1)+(52*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (basize+6+lyrange+9), view.sizex/15, view.sizey/8)
  }

  // This draw the bottom HP of the battle animation
  ctx.drawImage(jslix.getImg(0+(Math.ceil(lefthp/10)%10)), (basize+5)+(206*((view.sizex/2)-(basize+5)-2)/256), (view.sizey)-(basize+6+lyrange+9)-view.sizey/8, view.sizex/15, view.sizey/8)
  if(lefthp > 90)
    ctx.drawImage(jslix.getImg(0+1), (basize+5)+(209*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (view.sizey)-(basize+6+lyrange+9)-view.sizey/8, view.sizex/15, view.sizey/8)

  if(righthp > 90){
    ctx.drawImage(jslix.getImg(0+(Math.ceil(righthp/10)%10)), ((view.sizex/2)+1)+(32*((view.sizex/2)-(basize+5)-2)/256), (view.sizey)-(basize+6+lyrange+9)-view.sizey/8, view.sizex/15, view.sizey/8)
    ctx.drawImage(jslix.getImg(0+1), ((view.sizex/2)+1)+(35*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (view.sizey)-(basize+6+lyrange+9)-view.sizey/8, view.sizex/15, view.sizey/8)
  }else{
    ctx.drawImage(jslix.getImg(0+(Math.ceil(righthp/10)%10)), ((view.sizex/2)+1)+(52*((view.sizex/2)-(basize+5)-2)/256)-(view.sizex/15), (view.sizey)-(basize+6+lyrange+9)-view.sizey/8, view.sizex/15, view.sizey/8)
  }

  // Draws the center divider
  ctx.strokeStyle = 'black'
  ctx.beginPath()
  ctx.moveTo(view.sizex/2, basize)
  ctx.lineTo(view.sizex/2, view.sizey-basize)
  ctx.stroke()
}

// Thank you andrewsi - StackOverflow (yes I use it sometimes)
function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
