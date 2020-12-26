
# Image Library - Rundown

Most of the work for getting this to function will occur here. To make sure I get the functionality working for both Java and JavaScript, I will probably spawn README's in places where I feel they would be the most helpful. Here will list the useful functions and hopefully chart out the functionality of this class. I will check both sets of functionality at the same time.

New_core will get deleted from the repository once the functionality of the new stuff surpasses the functionality of new_core. This will make sure we are moving forward in a good fashion

## Useful Functions

### JavaScript

- void ctx.drawImage(image, dx, dy);
- void ctx.drawImage(image, dx, dy, dWidth, dHeight);
- void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

Pretty standard, it grabs a location and the width and height to place an image

### Java

- public abstract boolean drawImage(Image img, int x, int y, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, int width, int height, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, Color bgcolor, ImageObserver observer)
- public abstract boolean drawImage(Image img, int x, int y, int width, int height, Color bgcolor, ImageObserver observer)
- public abstract boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, ImageObserver observer)
- public abstract boolean drawImage(Image img, int dx1, int dy1, int dx2, int dy2, int sx1, int sy1, int sx2, int sy2, Color bgcolor, ImageObserver observer)

Java2D gives a lot of weird options, like allowing you to determine the background color, as well as handling the images sometimes like JavaScript with the width and the height, and other times as two separate boxes of images. Only time will tell if these two aspects work the same

### Draw

- function placeImg(ctx, num, dlx, dly)
- function drawImg(ctx, num, dlx, dly, dsx, dsy)
- function placeCropImg(ctx, num, slx, sly, dlx, dly)
- function drawCropImg(ctx, num, slx, sly, dlx, dly, dsx, dsy)
- function placeCutImg(ctx, num, slx, sly, ssx, ssy, dlx, dly)
- function drawCutImg(ctx, num, slx, sly, ssx, ssy, dlx, dly, dsx, dsy)

- ImgLibrary (starts at line 656) [Java]
- JSlix (starts at line 498) [JavaScript]

## Testing Grounds

- [ ] Make a Testing file [Java]
- [ ] Make a Testing file [JavaScript]

### Draw functions

- [ ] Verify the placeImg functionality is working [Java]
- [ ] Verify the drawImg functionality is working [Java]
- [ ] Verify the placeCropImg functionality is working [Java]
- [ ] Verify the drawCropImg functionality is working [Java]
- [ ] Verify the placeCutImg functionality is working [Java]
- [ ] Verify the drawCutImg functionality is working [Java]

- [ ] Verify the placeImg functionality is working [JavaScript]
- [ ] Verify the drawImg functionality is working [JavaScript]
- [ ] Verify the placeCropImg functionality is working [JavaScript]
- [ ] Verify the drawCropImg functionality is working [JavaScript]
- [ ] Verify the placeCutImg functionality is working [JavaScript]
- [ ] Verify the drawCutImg functionality is working [JavaScript]

### Text Library Functions

The Java version actually sets a limit in pixels of how far something should go before it can't go anymore. Something that we should most likely emulate in the JavaScript version of the code

- [ ] Verify the getTextImage functionality is working [Java]
- [ ] Verify the setString functionality is working [Java]
- [ ] Verify the setWords functionality is working [Java]
- [ ] Verify the setParagraphLine functionality is working [Java]
- [ ] Verify the setParagraph functionality is working [Java]

The JavaScript version works way differently, first creating an image and pushing it into the main pipeline of images, and then displaying the image as a normal image. I suppose that is okay, but there is a lot more tracking that'll have to take place.

- [ ] Verify the addTextImage functionality is working [JavaScript]
- [ ] Verify the setLetters functionality is working [JavaScript]
- [ ] Create the setWords functionality is added [JavaScript]
- [ ] Create the setParagraphLine functionality is added [JavaScript]
- [ ] Create the setParagraph functionality is added [JavaScript]
