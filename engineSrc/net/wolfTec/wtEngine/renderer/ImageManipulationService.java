package net.wolfTec.wtEngine.renderer;

import net.wolfTec.wtEngine.utility.BrowserHelperBean;

import org.stjs.javascript.Array;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

@Bean public class ImageManipulationService {

  @Injected private BrowserHelperBean browser;

  public Array<Integer> getImageData(Image image) {
    Canvas canvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasContext = canvas.getContext("2d");

    int imgW = image.width;
    int imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);

    return canvasContext.getImageData(0, 0, imgW, imgH).data;
  }

  /**
   * Changes colors in an assets object by given replacement color maps and
   * returns a new assets object (html5 canvas).
   * 
   * @param image
   * @param colorData
   * @param numColors
   * @param oriIndex
   * @param replaceIndex
   * @return Canvas with replaced colors
   */
  public Canvas replaceColors(Image image, CanvasImageData colorData, int numColors, int oriIndex,
      int replaceIndex) {
    Canvas canvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasContext = canvas.getContext("2d");

    // create target canvas
    int imgW = image.width;
    int imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    CanvasImageData imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    int oriStart = (oriIndex * 4) * numColors;
    int replStart = (replaceIndex * 4) * numColors;
    for (int y = 0; y < imgPixels.height; y++) {
      for (int x = 0; x < imgPixels.width; x++) {
        int xi = (y * 4) * imgPixels.width + x * 4;

        int oR = imgPixels.data.$get(xi);
        int oG = imgPixels.data.$get(xi + 1);
        int oB = imgPixels.data.$get(xi + 2);
        for (int n = 0, ne = (numColors * 4); n < ne; n += 4) {

          int sR = colorData.data.$get(oriStart + n);
          int sG = colorData.data.$get(oriStart + n + 1);
          int sB = colorData.data.$get(oriStart + n + 2);

          if (sR == oR && sG == oG && sB == oB) {

            int r = replStart + n;
            int rR = colorData.data.$get(r);
            int rG = colorData.data.$get(r + 1);
            int rB = colorData.data.$get(r + 2);
            imgPixels.data.$set(xi, rR);
            imgPixels.data.$set(xi + 1, rG);
            imgPixels.data.$set(xi + 2, rB);
          }
        }
      }
    }

    // write changes back
    canvasContext.putImageData(imgPixels, 0, 0);

    return canvas;
  }

  public Canvas convertImageToBlackMask(Image image) {
    Canvas canvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasContext = canvas.getContext("2d");

    // create target canvas
    int imgW = image.width;
    int imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    CanvasImageData imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    for (int y = 0; y < imgPixels.height; y++) {
      for (int x = 0; x < imgPixels.width; x++) {
        int xi = (y * 4) * imgPixels.width + x * 4;
        int oA = imgPixels.data.$get(xi + 3);

        // if pixel is not transparent, then fill it with black
        if (oA > 0) {
          imgPixels.data.$set(xi, 0);
          imgPixels.data.$set(xi + 1, 0);
          imgPixels.data.$set(xi + 2, 0);
        }
      }
    }

    // write changes back
    canvasContext.putImageData(imgPixels, 0, 0);

    return canvas;
  }

  /**
   * Flips an image.
   *
   * BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
   * 
   * @param image
   * @param flipH
   * @param flipV
   * @return
   */
  public Canvas flipImage(Image image, boolean flipH, boolean flipV) {
    int scaleH = flipH ? -1 : 1;
    int scaleV = flipV ? -1 : 1;
    int posX = flipH ? image.width * -1 : 0;
    int posY = flipV ? image.height * -1 : 0;

    // target canvas
    Canvas nCanvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D nContext = nCanvas.getContext("2d");
    nCanvas.height = image.height;
    nCanvas.width = image.width;

    // transform it
    nContext.save();
    nContext.scale(scaleH, scaleV);
    nContext.drawImage(image, posX, posY, image.width, image.height);
    nContext.restore();

    return nCanvas;
  }

  /**
   * Draws a part of an image to a new canvas.
   * 
   * @param image
   * @param sx
   * @param sy
   * @param w
   * @param h
   * @return
   */
  public Canvas cropImage(Image image, int sx, int sy, int w, int h) {
    Canvas canvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasContext = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;

    canvasContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);

    return canvas;
  }

  /**
   * 
   * @param image
   * @param sx
   * @param sy
   * @param w
   * @param rotation
   * @return
   */
  public Canvas cropAndRotate(Image image, int sx, int sy, int w, int rotation) {
    Canvas canvas = browser.createDomElement("canvas");
    CanvasRenderingContext2D context = canvas.getContext("2d");
    int hw = w / 2;

    canvas.height = w;
    canvas.width = w;

    // transform
    context.save();
    context.translate(hw, hw);
    context.rotate(rotation * Math.PI / 180);
    context.translate(-hw, -hw);

    // draw
    context.drawImage(image, sx, sy, w, w, 0, 0, w, w);

    context.restore();

    return canvas;
  }

  /**
   * 
   * Doubles the size of an assets by using the scale2x algorithm.
   * 
   * @param image
   * @return
   */
  public Canvas scaleImageWithScale2x(Image image) {
    int imgW = image.width;
    int imgH = image.height;
    int oR, oG, oB;
    int uR, uG, uB;
    int dR, dG, dB;
    int rR, rG, rB;
    int lR, lG, lB;
    int xi;
    int t0R, t0G, t0B;
    int t1R, t1G, t1B;
    int t2R, t2G, t2B;
    int t3R, t3G, t3B;

    // create target canvas
    Canvas canvasS = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasSContext = canvasS.getContext("2d");
    canvasS.width = imgW;
    canvasS.height = imgH;
    canvasSContext.drawImage(image, 0, 0);
    CanvasImageData imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);

    // create target canvas
    Canvas canvasT = browser.createDomElement("canvas");
    CanvasRenderingContext2D canvasTContext = canvasT.getContext("2d");
    canvasT.width = imgW * 2;
    canvasT.height = imgH * 2;
    CanvasImageData imgPixelsT = canvasTContext.getImageData(0, 0, imgW * 2, imgH * 2);

    // scale it
    for (int y = 0; y < imgPixelsS.height; y++) {
      for (int x = 0; x < imgPixelsS.width; x++) {

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // grab source pixels
        //

        // grab center
        xi = (y * 4) * imgPixelsS.width + x * 4;
        oR = imgPixelsS.data.$get(xi);
        oG = imgPixelsS.data.$get(xi + 1);
        oB = imgPixelsS.data.$get(xi + 2);

        // grab left
        if (x > 0) {
          xi = (y * 4) * imgPixelsS.width + (x - 1) * 4;
          lR = imgPixelsS.data.$get(xi);
          lG = imgPixelsS.data.$get(xi + 1);
          lB = imgPixelsS.data.$get(xi + 2);
        } else {
          lR = oR;
          lG = oG;
          lB = oB;
        }

        // grab up
        if (y > 0) {
          xi = ((y - 1) * 4) * imgPixelsS.width + (x) * 4;
          uR = imgPixelsS.data.$get(xi);
          uG = imgPixelsS.data.$get(xi + 1);
          uB = imgPixelsS.data.$get(xi + 2);
        } else {
          uR = oR;
          uG = oG;
          uB = oB;
        }

        // grab down
        if (x < imgPixelsS.height - 1) {
          xi = ((y + 1) * 4) * imgPixelsS.width + (x) * 4;
          dR = imgPixelsS.data.$get(xi);
          dG = imgPixelsS.data.$get(xi + 1);
          dB = imgPixelsS.data.$get(xi + 2);
        } else {
          dR = oR;
          dG = oG;
          dB = oB;
        }

        // grab right
        if (x < imgPixelsS.width - 1) {
          xi = (y * 4) * imgPixelsS.width + (x + 1) * 4;
          rR = imgPixelsS.data.$get(xi);
          rG = imgPixelsS.data.$get(xi + 1);
          rB = imgPixelsS.data.$get(xi + 2);
        } else {
          rR = oR;
          rG = oG;
          rB = oB;
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // calculates target pixels
        //

        // E0 = E; E1 = E; E2 = E; E3 = E;
        t0R = oR;
        t0G = oG;
        t0B = oB;
        t1R = oR;
        t1G = oG;
        t1B = oB;
        t2R = oR;
        t2G = oG;
        t2B = oB;
        t3R = oR;
        t3G = oG;
        t3B = oB;

        // if (B != H && D != F)
        if ((uR != dR || uG != dG || uB != dB) && (lR != rR || lG != rG || lB != rB)) {

          // E0 = D == B ? D : E;
          if (uR == lR && uG == lG && uB == lB) {
            t0R = lR;
            t0G = lG;
            t0B = lB;
          }

          // E1 = B == F ? F : E;
          if (uR == rR && uG == rG && uB == rB) {
            t1R = rR;
            t1G = rG;
            t1B = rB;
          }

          // E2 = D == H ? D : E;
          if (lR == dR && lG == dG && lB == dB) {
            t2R = lR;
            t2G = lG;
            t2B = lB;
          }

          // E3 = H == F ? F : E;
          if (dR == rR && dG == rG && dB == rB) {
            t3R = rR;
            t3G = rG;
            t3B = rB;
          }
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // write pixels to target canvas
        //

        xi = ((y * 2) * 4) * imgPixelsT.width + (x * 2) * 4;
        imgPixelsT.data.$set(xi + 0, t0R);
        imgPixelsT.data.$set(xi + 1, t0G);
        imgPixelsT.data.$set(xi + 2, t0B);
        imgPixelsT.data.$set(xi + 4, t1R);
        imgPixelsT.data.$set(xi + 5, t1G);
        imgPixelsT.data.$set(xi + 6, t1B);

        xi = ((y * 2 + 1) * 4) * imgPixelsT.width + (x * 2) * 4;
        imgPixelsT.data.$set(xi + 0, t2R);
        imgPixelsT.data.$set(xi + 1, t2G);
        imgPixelsT.data.$set(xi + 2, t2B);
        imgPixelsT.data.$set(xi + 4, t3R);
        imgPixelsT.data.$set(xi + 5, t3G);
        imgPixelsT.data.$set(xi + 6, t3B);
      }
    }

    // write changes back to the canvas
    canvasTContext.putImageData(imgPixelsT, 0, 0);

    canvasS = null;
    return canvasT;
  }
}
