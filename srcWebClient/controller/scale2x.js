// Doubles the size of an image by using the scale2x algorithm.
//
view.scale2x_doIt = function( img ){
  var imgW = image.width;
  var imgH = image.height;
  var oR,oG,oB;
  var uR,uG,uB;
  var dR,dG,dB;
  var rR,rG,rB;
  var lR,lG,lB;
  var xi;
  var t0R,t0G,t0B;
  var t1R,t1G,t1B;
  var t2R,t2G,t2B;
  var t3R,t3G,t3B;
  
  // create target canvas
  var canvasS = document.createElement("canvas");
  var canvasSContext = canvas.getContext("2d");
  canvasS.width = imgW;
  canvasS.height = imgH;
  canvasSContext.drawImage( image, 0, 0);
  var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);
  
  // create target canvas
  var canvasT = document.createElement("canvas");
  var canvasTContext = canvas.getContext("2d");
  canvasT.width = imgW*2;
  canvasT.height = imgH*2;
  var imgPixelsT = canvasTContext.getImageData(0, 0, imgW*2, imgH*2);
  
  // scale it
  for(var y = 0; y < imgPixels.height; y++){
    for(var x = 0; x < imgPixels.width; x++){
          
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // grab source pixels  
        //
        
        // grab center
        xi = (y * 4) * imgPixels.width + x * 4;
        oR = imgPixelsS.data[xi ];
        oG = imgPixelsS.data[xi+1];
        oB = imgPixelsS.data[xi+2];
        
        // grab left
        if( x > 0 ){
          xi = (y * 4) * imgPixels.width + (x-1) * 4;
          lR = imgPixelsS.data[xi ];
          lG = imgPixelsS.data[xi+1];
          lB = imgPixelsS.data[xi+2];
        }
        else{
          lR = oR;
          lG = oG;
          lB = oB;
        }
        
        // grab up
        if( y > 0 ){
          xi = ((y-1) * 4) * imgPixels.width + (x) * 4;
          uR = imgPixelsS.data[xi ];
          uG = imgPixelsS.data[xi+1];
          uB = imgPixelsS.data[xi+2];
        }
        else{
          uR = oR;
          uG = oG;
          uB = oB;
        }
        
        // grab down
        if( x < imgPixels.height-1 ){
          xi = ((y+1) * 4) * imgPixels.width + (x) * 4;
          dR = imgPixelsS.data[xi ];
          dG = imgPixelsS.data[xi+1];
          dB = imgPixelsS.data[xi+2];
        }
        else{
          dR = oR;
          dG = oG;
          dB = oB;
        }
        
        // grab right
        if( x < imgPixels.width-1 ){
          xi = (y * 4) * imgPixels.width + (x+1) * 4;
          rR = imgPixelsS.data[xi ];
          rG = imgPixelsS.data[xi+1];
          rB = imgPixelsS.data[xi+2];
        }
        else{
          rR = oR;
          rG = oG;
          rB = oB;
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // calculates target pixels  
        //
        
        // E0 = E; E1 = E; E2 = E; E3 = E;
        t0R = oR; t0G = oG; t0B = oB;
        t1R = oR; t1G = oG; t1B = oB;
        t2R = oR; t2G = oG; t2B = oB;
        t3R = oR; t3G = oG; t3B = oB;
        
        // if (B != H && D != F)
        if( ( uR !== dR || uG !== dG || uB !== dB ) && ( lR !== rR || lG !== rG || lB !== rB ) ){
          
          // E0 = D == B ? D : E;
          if( uR === lR && uG === lG && uB === lB ){
            t0R = lR; t0G = lG; t0B = lB;
          }
          
          // E1 = B == F ? F : E;
          if( uR === rR && uG === rG && uB === rB ){
            t1R = rR; t1G = rG; t1B = rB;
          }
          
          // E2 = D == H ? D : E;
          if( lR === dR && lG === dG && lB === dB ){
            t2R = lR; t2G = lG; t2B = lB;
          }
          
          // E3 = H == F ? F : E;
          if( dR === rR && dG === rG && dB === rB ){
            t3R = rR; t3G = rG; t3B = rB;
          }
        }
        
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // write pixels to target canvas
        //
        
        xi = ((y*2) * 4) * imgPixels.width + (x*2) * 4;
        imgPixelsT.data[xi+0] = t0R;
        imgPixelsT.data[xi+1] = t0G;
        imgPixelsT.data[xi+2] = t0B;
        imgPixelsT.data[xi+4] = t1R;
        imgPixelsT.data[xi+5] = t1G;
        imgPixelsT.data[xi+6] = t1B;
        
        xi = ((y*2+1) * 4) * imgPixels.width + (x*2) * 4;
        imgPixelsT.data[xi+0] = t2R;
        imgPixelsT.data[xi+1] = t2G;
        imgPixelsT.data[xi+2] = t2B;
        imgPixelsT.data[xi+4] = t3R;
        imgPixelsT.data[xi+5] = t3G;
        imgPixelsT.data[xi+6] = t3B;
      }
    }
    
  }
      
  // write changes back to the canvas    
  canvasTContext.putImageData(imgPixelsT, 0, 0 );
  
  canvasS = null;
  return canvasT;
};
